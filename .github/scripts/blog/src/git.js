const { execSync } = require('child_process');

function sh(cmd, cwd) {
  return execSync(cmd, { cwd, stdio: 'pipe' }).toString().trim();
}

function commitAndPush({ siteRoot, slug, branch, authorName, authorEmail }) {
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: authorName,
    GIT_AUTHOR_EMAIL: authorEmail,
    GIT_COMMITTER_NAME: authorName,
    GIT_COMMITTER_EMAIL: authorEmail
  };

  execSync('git add -A', { cwd: siteRoot, env, stdio: 'inherit' });

  // If nothing changed, skip
  try {
    execSync('git diff --cached --quiet', { cwd: siteRoot, env });
    console.log('No changes staged — skipping commit.');
    return;
  } catch {
    // There are staged changes, continue
  }

  execSync(`git commit -m "blog: publish ${slug}"`, { cwd: siteRoot, env, stdio: 'inherit' });
  execSync(`git push origin ${branch}`, { cwd: siteRoot, env, stdio: 'inherit' });
}

module.exports = { commitAndPush };
