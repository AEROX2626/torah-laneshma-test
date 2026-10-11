"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SiteDocRenderer from "@/app/components/SiteDocRenderer";
import { SiteDoc } from "@/lib/tree";

function PreviewContent() {
  const searchParams = useSearchParams();
  const docId = searchParams.get("docId") || "page_home";

  const [doc, setDoc] = useState<SiteDoc | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetch(`/api/admin/editor?docId=${docId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.doc) setDoc(data.doc);
      })
      .catch(console.error);
  }, [docId]);

  // Handle postMessage communication from parent editor
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;

      if (e.data.type === "UPDATE_DOC") {
        setDoc(e.data.doc);
      }

      if (e.data.type === "SET_SELECTED_NODE") {
        setSelectedNodeId(e.data.nodeId);
        if (e.data.nodeId) {
          const el = document.querySelector(`[data-node-id="${e.data.nodeId}"]`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Intercept all clicks to select nodes and block default navigation
  useEffect(() => {
    const handleClickCapture = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement | null;
      const nodeEl = target?.closest("[data-node-id]") as HTMLElement | null;
      const nodeId = nodeEl?.getAttribute("data-node-id");

      if (nodeId) {
        setSelectedNodeId(nodeId);
        window.parent.postMessage({ type: "NODE_CLICKED", nodeId }, "*");
      }
    };

    window.addEventListener("click", handleClickCapture, true);
    return () => window.removeEventListener("click", handleClickCapture, true);
  }, []);

  if (!doc) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center font-bold text-neutral-400">
        טוען תצוגה חיה...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 font-sans text-ink-900" dir="rtl">
      <SiteDocRenderer
        doc={doc}
        isEditing={true}
        selectedNodeId={selectedNodeId}
        onSelectNode={(id) => {
          setSelectedNodeId(id);
          window.parent.postMessage({ type: "NODE_CLICKED", nodeId: id }, "*");
        }}
      />
    </div>
  );
}

export default function EditorPreviewPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">טוען...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
