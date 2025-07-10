#!/usr/bin/env ts-node
import { intro, isCancel, outro, text } from '@clack/prompts';
import 'dotenv/config';
import picocolors from 'picocolors';
import { GitHubProjectCreator } from './GitHubProjectCreator.js';
const { blue, bold, red, yellow, green } = picocolors;

async function main() {
	intro(`${blue('🚀 GitHub Project Creator')}`);

	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		outro('❌ Defina a variável de ambiente GITHUB_TOKEN com sua token do GitHub.');
		process.exit(1);
	}

	const repoName = await text({
		message: 'Nome do repositório:',
		placeholder: 'ex: meu-projeto-legal',
	});
	if (isCancel(repoName) || !repoName) {
		outro('🚪 Cancelado.');
		process.exit(0);
	}

	const creator = new GitHubProjectCreator(token);
	await creator.init();

	const success = await creator.createRepoTransactional(repoName);
	if (success) {
		outro(`${blue('🎉')} Repositório ${bold(repoName)} criado com sucesso!`);
	} else {
		// createRepoTransactional já imprimiu logs de erro/rollback
		process.exit(1);
	}
}

main();
