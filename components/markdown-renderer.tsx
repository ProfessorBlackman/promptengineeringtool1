import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark} from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownRendererProps {
    content: string;
    className?: string;
    proseSize?: "sm" | "md" | "lg";
    isHighlighted?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
                                                               content,
                                                               className = "",
                                                               proseSize = "md",
                                                               isHighlighted = true
                                                           }) => {
    const proseClass =
        proseSize === "sm"
            ? "prose prose-sm max-w-none dark:prose-invert"
            : proseSize === "lg"
                ? "prose prose-lg max-w-none dark:prose-invert"
                : "prose max-w-none dark:prose-invert";

    return (
        <div className={`${proseClass} ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    pre: ({children, ...props}) => (
                        <pre
                            className="whitespace-pre-wrap break-words overflow-x-auto bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700"
                            {...props}
                        >
              {children}
            </pre>
                    ),
                    code: ({children, className, ...props}) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !(className && match);
                        if (!isInline && match) {
                            if (isHighlighted) {
                                return (<SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div">
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>)
                            } else {
                                return (
                                    <p>
                                        {String(children).replace(/\n$/, "")}
                                    </p>
                                )
                            }
                        }
                        return (
                            <code
                                className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-[1em] font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },
                    p: ({children, ...props}) => (
                        <p className="break-words" {...props}>{children}</p>
                    ),
                    strong: ({children, ...props}) => (
                        <strong className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded" {...props}>{children}</strong>
                    ),
                    em: ({children, ...props}) => (
                        <em className="bg-blue-100 dark:bg-blue-900 px-1 rounded" {...props}>{children}</em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;

