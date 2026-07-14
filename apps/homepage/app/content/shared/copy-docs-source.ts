function copyWithSelection(source: string) {
  const textarea = document.createElement('textarea');
  textarea.value = source;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    textarea.remove();
  }
}

export async function copyDocsSource(source: string) {
  const clipboardWrite = navigator.clipboard?.writeText;

  if (clipboardWrite === undefined) {
    return copyWithSelection(source);
  }

  const clipboardResult = clipboardWrite
    .call(navigator.clipboard, source)
    .then(() => true)
    .catch(() => false);
  const fallbackResult = copyWithSelection(source);
  const clipboardTimeout = new Promise<false>((resolve) => {
    window.setTimeout(() => resolve(false), 400);
  });

  return (await Promise.race([clipboardResult, clipboardTimeout])) || fallbackResult;
}
