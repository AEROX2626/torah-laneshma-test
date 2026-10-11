import React from "react";

export type NodeType =
  | "section"
  | "container"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "icon"
  | "divider"
  | "accordion"
  | "form"
  | "html";

export interface ResponsiveStyle {
  desktop?: Record<string, string | number>;
  tablet?: Record<string, string | number>;
  mobile?: Record<string, string | number>;
}

export interface NodeStyleState {
  base?: ResponsiveStyle;
  hover?: ResponsiveStyle;
  before?: ResponsiveStyle;
  after?: ResponsiveStyle;
}

export interface SiteNode {
  id: string;
  type: NodeType;
  name?: string;
  tag?: string;
  classes?: string;
  props?: Record<string, any>;
  style?: NodeStyleState;
  css?: string;
  hide?: { desktop?: boolean; tablet?: boolean; mobile?: boolean };
  settings?: Record<string, any>;
  bind?: "title" | "content" | "faqs" | "shabbat";
  children?: SiteNode[];
}

export interface SiteDoc {
  id: string;
  kind: "page" | "header" | "footer" | "popup" | "template";
  title?: string;
  path?: string;
  settings?: Record<string, any>;
  nodes: SiteNode[];
  revision: number;
  updated_at?: string;
}

// Generate CSS for a node across desktop, tablet (<=1024px), and mobile (<=767px)
export function generateNodeCss(node: SiteNode): string {
  let css = "";
  const className = `n-${node.id}`;

  const renderRule = (styles: Record<string, string | number> | undefined, pseudo = "") => {
    if (!styles || Object.keys(styles).length === 0) return "";
    const rules = Object.entries(styles)
      .map(([prop, val]) => {
        const kebab = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${kebab}: ${val};`;
      })
      .join(" ");
    return `.${className}${pseudo} { ${rules} }`;
  };

  // Base styles
  if (node.style?.base?.desktop) css += renderRule(node.style.base.desktop);
  if (node.style?.hover?.desktop) css += renderRule(node.style.hover.desktop, ":hover");

  // Tablet media query
  const tabletBase = renderRule(node.style?.base?.tablet);
  const tabletHover = renderRule(node.style?.hover?.tablet, ":hover");
  if (tabletBase || tabletHover) {
    css += ` @media (max-width: 1024px) { ${tabletBase} ${tabletHover} }`;
  }

  // Mobile media query
  const mobileBase = renderRule(node.style?.base?.mobile);
  const mobileHover = renderRule(node.style?.hover?.mobile, ":hover");
  if (mobileBase || mobileHover) {
    css += ` @media (max-width: 767px) { ${mobileBase} ${mobileHover} }`;
  }

  // Recurse children
  if (node.children) {
    for (const child of node.children) {
      css += " " + generateNodeCss(child);
    }
  }

  return css;
}

// Helper to find a node by ID in the tree
export function findNode(nodes: SiteNode[], id: string): SiteNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper to update a node in the tree immutably
export function updateNode(nodes: SiteNode[], id: string, updater: (node: SiteNode) => SiteNode): SiteNode[] {
  return nodes.map((n) => {
    if (n.id === id) {
      return updater(n);
    }
    if (n.children) {
      return {
        ...n,
        children: updateNode(n.children, id, updater),
      };
    }
    return n;
  });
}
