interface RepositoryProps {
  owner: string;
  name: string;
}

class GitHub {
  public headers: Record<string, string>;

  constructor(token: string, public repo: RepositoryProps, public baseUrl: string = 'https://api.github.com') {
    this.headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  get baseRepoUrl() {
    return `${this.baseUrl}/repos/${this.repo.owner}/${this.repo.name}`;
  }

  getCommitSha(branch: string) {
    const res = UrlFetchApp.fetch(`${this.baseRepoUrl}/git/refs/heads/${branch}`, {
      method: 'get',
      headers: this.headers,
    });
    const data = JSON.parse(res.getContentText('utf-8'));
    return data.object.sha;
  }

  createBranch(fromCommitSha: string, branch: string) {
    UrlFetchApp.fetch(`${this.baseRepoUrl}/git/refs`, {
      method: 'post',
      headers: this.headers,
      payload: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: fromCommitSha,
      }),
    });
    return;
  }

  uploadFile(branch: string, filePath: string, message: string, content: string) {
    UrlFetchApp.fetch(`${this.baseRepoUrl}/contents/${filePath}`, {
      method: 'put',
      headers: this.headers,
      payload: JSON.stringify({
        branch,
        message,
        content,
        path: filePath,
      }),
    });
    return;
  }

  createPullRequest(
    headBranch: string,
    baseBranch: string,
    content: {
      title: string;
      body: string;
    },
  ) {
    UrlFetchApp.fetch(`${this.baseRepoUrl}/pulls`, {
      method: 'post',
      headers: this.headers,
      payload: JSON.stringify({
        title: content.title,
        body: content.body,
        head: headBranch,
        base: baseBranch,
      }),
    });
  }
}

export default GitHub;
