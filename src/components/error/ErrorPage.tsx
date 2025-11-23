import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/not-found.css';

interface ErrorPageProps {
  code: string | number;
  title: string;
  message: string;
  imageSrc?: string;
  linkTo?: string;
  linkAriaLabel?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  title,
  message,
  imageSrc = '/zorro_back_home.png',
  linkTo = '/',
  linkAriaLabel = 'Volver al inicio',
}) => {
  return (
    <div className="oc-notfound-root">
      <div className="oc-notfound-blobs">
        <div className="oc-notfound-blob oc-notfound-blob--tl" />
        <div className="oc-notfound-blob oc-notfound-blob--br" />
      </div>

      <main className="oc-notfound-main" role="main">
        <div className="oc-notfound-head">
          <h1 className="oc-notfound-code">{code}</h1>
          <h2 className="oc-notfound-title">{title}</h2>
        </div>

        <p className="oc-notfound-text">
          {message.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < message.split('\n').length - 1 && <br className="oc-notfound-br" />}
            </React.Fragment>
          ))}
        </p>

        <Link to={linkTo} aria-label={linkAriaLabel} className="oc-notfound-link">
          <div className="oc-notfound-illustration" role="img" aria-label={title}>
            <img src={imageSrc} alt={title} className="oc-notfound-image" />
          </div>
        </Link>
      </main>
    </div>
  );
};

export default ErrorPage;
