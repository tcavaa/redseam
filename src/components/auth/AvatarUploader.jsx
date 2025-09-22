import React from 'react';
import { CameraIcon } from '../ui';
import { useFilePreview } from '../../hooks/useFilePreview';

export default function AvatarUploader({ fileList, registerProps, onRemove, error }) {
  const previewUrl = useFilePreview(fileList);

  return (
    <div className="avatar-upload">
      {previewUrl ? (
        <>
          <div className="avatar-preview"><img src={previewUrl} alt="Avatar preview" /></div>
          <label className="avatar-actions">
            <input type="file" accept="image/*" hidden {...registerProps} />
            <span>Upload new</span>
          </label>
          <button type="button" className="link" onClick={onRemove}>Remove</button>
        </>
      ) : (
        <label className="avatar-placeholder">
          <input type="file" accept="image/*" hidden {...registerProps} />
          <div className="avatar-circle">
            <img className="camera-icon" src={CameraIcon} alt="Upload" />
          </div>
          <span className="placeholder-text">Upload image</span>
        </label>
      )}
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
}


