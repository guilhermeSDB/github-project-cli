import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import path from 'path';

const log = console.log;

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: true });
}

log('📦 Iniciando build e geração do executável...');

log('🛠️ Compilando TypeScript...');
run('npm run build');

const releasesDir = path.resolve('releases');

if (existsSync(releasesDir)) {
  log('🧹 Limpando releases anteriores...');
  rmSync(releasesDir, { recursive: true, force: true });
}

mkdirSync(releasesDir);

log('🚀 Gerando executável com pkg...');
run(`pkg dist/cli.js --targets node18-win-x64 --output releases/create-github-project.exe`);

log('✅ Build finalizado! Executável disponível em ./releases');
