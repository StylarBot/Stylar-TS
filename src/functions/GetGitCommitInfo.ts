import axios from "axios";
import git from 'git-commit-count';
import info from '../../StylarInfo.json';

export default async function GetGitCommitInfo() {
    const { data } = await axios.get(`${info.gitAPIURL}/commits`);
    const dater = data[0];

    git();
    const count = await git(`${info.gitRepo}`);
    const version = `v0.${count / 10}`;
    const updatedate = new Date(dater.commit.committer.date);
    const updatedms = updatedate.getTime();

    const repo = await axios.get(info.gitAPIURL);

    const creationdate = new Date(repo.data.created_at);
    const creationms = creationdate.getTime();

    const repoStats = {
        Version: version,
        CreationMS: creationms,
        LatestCommit: {
            Message: dater.commit.message,
            Author: dater.commit.committer.name,
            IconURL: dater.author.avatar_url,
            PushedMS: updatedms,
        }
    }

    return repoStats;
}