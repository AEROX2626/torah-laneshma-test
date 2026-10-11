"use client";

import React from "react";
import { SiteDoc, SiteNode, generateNodeCss } from "@/lib/tree";

interface RendererProps {
  doc?: SiteDoc;
  nodes?: SiteNode[];
  isEditing?: boolean;
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export default function SiteDocRenderer({
  doc,
  nodes,
  isEditing = false,
  onSelectNode,
  selectedNodeId,
}: RendererProps) {
  const treeNodes = nodes || doc?.nodes || [];

  // Generate responsive CSS for all nodes
  const allCss = treeNodes.map((n) => generateNodeCss(n)).join("\n");

  const renderNode = (node: SiteNode): React.ReactNode => {
    const isSelected = selectedNodeId === node.id;
    const nodeClass = `n-${node.id} ${node.classes || ""}`.trim();

    const editAttributes = isEditing
      ? {
          "data-node-id": node.id,
          "data-node-type": node.type,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onSelectNode) onSelectNode(node.id);
          },
          className: `${nodeClass} ${
            isSelected
              ? "outline-2 outline-primary-500 outline-offset-2 relative z-20"
              : "hover:outline-1 hover:outline-primary-300 hover:outline-dashed"
          }`,
        }
      : { className: nodeClass };

    const children = node.children ? node.children.map(renderNode) : null;

    switch (node.type) {
      case "section":
        return (
          <section key={node.id} id={node.id} {...editAttributes}>
            {children}
          </section>
        );

      case "container":
        return (
          <div key={node.id} {...editAttributes}>
            {children}
          </div>
        );

      case "heading": {
        const Tag = (node.tag || "h2") as any;
        return (
          <Tag key={node.id} {...editAttributes}>
            {node.props?.text}
            {children}
          </Tag>
        );
      }

      case "text":
        return (
          <p key={node.id} {...editAttributes}>
            {node.props?.text}
            {children}
          </p>
        );

      case "button":
        return (
          <a
            key={node.id}
            href={node.props?.href || "#"}
            target={node.props?.target || "_self"}
            {...editAttributes}
          >
            {node.props?.text || "לחץ כאן"}
          </a>
        );

      case "image":
        return (
          <img
            key={node.id}
            src={node.props?.src || "/placeholder.jpg"}
            alt={node.props?.alt || ""}
            {...editAttributes}
          />
        );

      case "divider":
        return <hr key={node.id} {...editAttributes} />;

      case "html":
        return (
          <div
            key={node.id}
            dangerouslySetInnerHTML={{ __html: node.props?.html || "" }}
            {...editAttributes}
          />
        );

      default:
        return (
          <div key={node.id} {...editAttributes}>
            {children}
          </div>
        );
    }
  };

  return (
    <>
      {allCss && <style dangerouslySetInnerHTML={{ __html: allCss }} />}
      <div className="site-doc-tree-root">{treeNodes.map(renderNode)}</div>
    </>
  );
}
