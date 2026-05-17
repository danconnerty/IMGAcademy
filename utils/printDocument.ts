export const printHtmlDocument = (title: string, html: string): void => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', title);
  iframe.style.position = 'fixed';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.right = '0';
  iframe.style.bottom = '0';

  const cleanup = () => {
    iframe.remove();
  };

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }

    const afterPrint = () => {
      win.removeEventListener('afterprint', afterPrint);
      cleanup();
    };

    win.addEventListener('afterprint', afterPrint);
    win.focus();
    win.print();

    window.setTimeout(() => {
      if (document.body.contains(iframe)) cleanup();
    }, 60_000);
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);
};
