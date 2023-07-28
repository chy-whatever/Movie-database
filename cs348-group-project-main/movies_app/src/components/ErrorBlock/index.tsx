import React from 'react';

type ErrorBlockProps = {
    title: string;
    message: string;
}

const ErrorBlock: React.FC<ErrorBlockProps> = ({ title, message }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: {title}</strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorBlock;
