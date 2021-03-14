'use strict';

/*
 * ダークカナリアリリース用のHTTPヘッダーを追加する。
 */
const env = process.env,
  releaseModel = env.RELEASE_MODEL || '',
  fs = require('fs');

const addReleaseModelHeader = (releaseModel) => {
  if (releaseModel === '') {
    return;
  }
  const httpInterceptorFilePath =
    './src/app/http-interceptors/http-header-interceptor.ts';
  let httpInterceptorFile = fs.readFileSync(httpInterceptorFilePath, 'utf-8');
  httpInterceptorFile = httpInterceptorFile.replace(
    /\/\* \{RELEASE_MODEL\} \*\//,
    `.set('x-relase-model', '${releaseModel}')`
  );
  fs.writeFileSync(httpInterceptorFilePath, httpInterceptorFile);
};

addReleaseModelHeader(releaseModel);
