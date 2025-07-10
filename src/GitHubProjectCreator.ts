// src/GitHubProjectCreator.ts
import { RequestError } from '@octokit/request-error';
import { Octokit } from '@octokit/rest';

export class GitHubProjectCreator {
	private octokit: Octokit;
	private username = '';

	constructor(private token: string) {
		this.octokit = new Octokit({ auth: token });
	}

	async init(): Promise<void> {
		const { data: user } = await this.octokit.rest.users.getAuthenticated();
		this.username = user.login;
	}

	/**
	 * Retorna `true` se tudo rodou ok.
	 * Retorna `false` se houve rollback (proteção falhou e repo foi deletado).
	 */
	async createRepoTransactional(repoName: string): Promise<boolean> {
		let repoCreated = false;

		try {
			// 1) Criar repositório
			const { data: repo } = await this.octokit.repos.createForAuthenticatedUser({
				name: repoName,
				private: true,
				auto_init: true,
			});
			repoCreated = true;
			console.log(`✅  Repositório ${repo.full_name} criado.`);

			// 2) Criar branch dev
			const { data: mainRef } = await this.octokit.git.getRef({
				owner: this.username,
				repo: repoName,
				ref: 'heads/main',
			});
			await this.octokit.git.createRef({
				owner: this.username,
				repo: repoName,
				ref: 'refs/heads/dev',
				sha: mainRef.object.sha,
			});
			console.log('🌱  Branch dev criada.');

			// 3) Tentar proteger main
			try {
				await this.octokit.repos.updateBranchProtection({
					owner: this.username,
					repo: repoName,
					branch: 'main',
					required_status_checks: null,
					enforce_admins: true,
					required_pull_request_reviews: { required_approving_review_count: 1 },
					restrictions: null,
				});
				console.log('🔒  Proteção da branch main ativada.');
			} catch (err: any) {
				if (err instanceof RequestError && err.status === 403 &&
					err.message.includes('Upgrade to GitHub Pro')) {
					console.warn(
						'⚠️  Não foi possível proteger a branch main (requer GitHub Pro ou repo público).'
					);
					// Fazemos rollback, pois o usuário pediu proteção
					// Deletar o repo para voltar ao estado inicial
					await this.octokit.repos.delete({
						owner: this.username,
						repo: repoName,
					});
					console.log('♻️  Rollback: repositório deletado.');
					return false;
				} else {
					throw err;
				}
			}

			// Se chegamos até aqui, tudo deu certo (criamos + dev + proteção)
			return true;

		} catch (err: any) {
			// Caso de name exists ou outros erros antes da proteção
			if (!repoCreated && err instanceof RequestError && err.status === 422) {
				console.error(`❌ Repositório “${repoName}” já existe. Use outro nome.`);
				process.exit(1);
			}
			console.error(`❌ ${err.message}`);

			// Se criamos o repo mas não chegamos a proteção
			if (repoCreated) {
				try {
					await this.octokit.repos.delete({
						owner: this.username,
						repo: repoName,
					});
					console.log('♻️ Rollback: repositório deletado.');
				} catch (delErr: any) {
					console.warn(`⚠️ Não foi possível desfazer automaticamente: ${delErr.message}`);
					console.warn(`👉 Apague manualmente em https://github.com/${this.username}/${repoName}`);
				}
			}

			return false;
		}
	}
}
