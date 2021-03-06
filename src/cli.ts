#!/usr/bin/env node
import meow from 'meow';
import {
  closeBrowser,
  getLikedVideo,
  getSearchHistory,
  getSearchVideoPage,
  getSubscribedChannels,
  getVideoPage,
  getWatchHistory,
  loginYoutube,
} from './get-html';
import { monitorDeNews } from './monitor';

const cliHelpText = `
  Usage
    $ harke -l
    $ harke -a
`;

const cli = meow(cliHelpText, {
  flags: {
    login: { type: 'boolean', alias: 'l' },
    playlist: { type: 'boolean', alias: 'p' },
    likedVideos: { type: 'boolean', alias: 'i' },
    video: {
      type: 'string',
      alias: 'v',
    },
    searchVideos: {
      type: 'string',
      alias: 's',
    },
    watchHistory: {
      type: 'boolean',
      alias: 'w',
    },
    searchHistory: {
      type: 'boolean',
      alias: 'h',
    },
    subscribedChannels: {
      type: 'boolean',
      alias: 'c',
    },
    all: {
      type: 'boolean',
      alias: 'a',
    },
    outputLocation: {
      type: 'string',
      alias: 'o',
      default: 'html',
    },
    monitor: {
      type: 'boolean',
      alias: 'm',
    },
    dbLocation: {
      type: 'string',
      default: 'data/db.json',
    },
  },
});

(async function () {
  let close = true;

  console.log('storing htmls files in: ' + cli.flags.outputLocation);
  console.log('storing monitor data in: ' + cli.flags.dbLocation);

  if (cli.flags.login) {
    loginYoutube();
    close = false;
  }

  if (cli.flags.all || cli.flags.watchHistory) {
    await getWatchHistory(cli.flags.outputLocation);
  }

  if (cli.flags.all || cli.flags.searchHistory) {
    const res = await getSearchHistory(cli.flags.outputLocation);
    for (const x of res.fields.queries) {
      console.log(x);
    }
  }

  if (cli.flags.all || cli.flags.subscribedChannels) {
    await getSubscribedChannels(cli.flags.outputLocation);
  }

  if (cli.flags.all || cli.flags.likedVideos) {
    await getLikedVideo(cli.flags.outputLocation);
  }

  if (cli.flags.all || cli.flags.video != null) {
    await getVideoPage(
      cli.flags.video ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      cli.flags.outputLocation,
    );
  }

  if (cli.flags.all || cli.flags.searchVideos != null) {
    await getSearchVideoPage(
      cli.flags.searchVideos ?? 'antifa',
      cli.flags.outputLocation,
    );
  }

  if (cli.flags.monitor) {
    close = true;
    await monitorDeNews(cli.flags.dbLocation);
  }

  if (close) await closeBrowser();
})();
