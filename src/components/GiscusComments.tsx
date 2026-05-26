'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <Giscus
      id="comments"
      repo="mazinhoww-web/an-site"
      repoId=""
      category="Comments"
      categoryId=""
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="pt"
      loading="lazy"
    />
  );
}
