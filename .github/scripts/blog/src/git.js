const { execSync, spawnSync } = require('child_process');

function commitAndPush({ siteRoot, slug, branch, authorName, authorEmail, paths }) {
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: authorName,
    GIT_AUTHOR_EMAIL: authorEmail,
    GIT_COMMITTER_NAME: authorName,
    GIT_COMMITTER_EMAIL: authorEmail
  };

  const addArgs = paths && paths.length ? ['add', '--', ...paths] : ['add', '-A'];
  const addResult = spawnSync('git', addArgs, { cwd: siteRoot, env, stdio: 'inherit' });
  if (addResult.status !== 0) throw new Error(`git add failed (status ${addResult.status})`);

  const diffResult = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: siteRoot, env });
  if (diffResult.status === 0) {
    console.log('No changes staged — skipping commit.');
    return;
  }

  execSync(`git commit -m "blog: publish ${slug}"`, { cwd: siteRoot, env, stdio: 'inherit' });
  execSync(`git push origin ${branch}`, { cwd: siteRoot, env, stdio: 'inherit' });
}

module.exports = { commitAndPush };
