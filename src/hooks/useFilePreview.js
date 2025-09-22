import { useEffect, useState } from 'react';

export function useFilePreview(fileList) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!fileList || fileList.length === 0) { setUrl(null); return; }
    const file = fileList[0];
    if (!(file instanceof File)) { setUrl(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileList]);
  return url;
}


