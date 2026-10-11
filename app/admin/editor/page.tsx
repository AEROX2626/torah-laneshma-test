"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SiteDoc, SiteNode, findNode, updateNode } from "@/lib/tree";

export default function VisualEditorPage() {
  const [docId, setDocId] = useState("page_home");
  const [doc, setDoc] = useState<SiteDoc | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"structure" | "add" | "element" | "page">("structure");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [elementSubTab, setElementSubTab] = useState<"content" | "style">("content");

  // Undo / Redo history
  const [history, setHistory] = useState<SiteDoc[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Status indicators
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>("טיוטה מסונכרנת");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load Doc
  useEffect(() => {
    fetch(`/api/admin/editor?docId=${docId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.doc) {
          setDoc(data.doc);
          setHistory([data.doc]);
          setHistoryIndex(0);
          if (data.doc.nodes.length > 0) {
            setSelectedNodeId(data.doc.nodes[0].id);
          }
        }
      })
      .catch(console.error);
  }, [docId]);

  // Sync state to iframe via postMessage
  const syncToIframe = (updatedDoc: SiteDoc) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_DOC", doc: updatedDoc },
        "*"
      );
    }
  };

  // Push new state to history & sync
  const updateDocState = (newDoc: SiteDoc) => {
    setDoc(newDoc);
    syncToIframe(newDoc);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDoc);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Auto-save draft debounced
    triggerAutoSave(newDoc);
  };

  const triggerAutoSave = async (docToSave: SiteDoc) => {
    setIsSaving(true);
    setStatusMessage("שומר טיוטה...");
    try {
      await fetch("/api/admin/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId, doc: docToSave, action: "draft" }),
      });
      setStatusMessage("✓ טיוטה נשמרה");
    } catch {
      setStatusMessage("שגיאה בשמירה");
    } finally {
      setIsSaving(false);
    }
  };

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDoc(prev);
      syncToIframe(prev);
      triggerAutoSave(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDoc(next);
      syncToIframe(next);
      triggerAutoSave(next);
    }
  };

  // Publish handler
  const handlePublish = async () => {
    if (!doc) return;
    setIsPublishing(true);
    setStatusMessage("מפרסם...");
    try {
      const res = await fetch("/api/admin/editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId, doc, action: "publish" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("✓ פורסם בהצלחה באתר!");
        setDoc(data.doc);
      }
    } catch {
      setStatusMessage("שגיאה בפרסום");
    } finally {
      setIsPublishing(false);
    }
  };

  // Listen to postMessage from iframe when a user clicks a node
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "NODE_CLICKED" && e.data.nodeId) {
        setSelectedNodeId(e.data.nodeId);
        setActiveTab("element");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const selectedNode = doc && selectedNodeId ? findNode(doc.nodes, selectedNodeId) : null;

  // Tree manipulation handlers
  const handleDuplicateNode = (id: string) => {
    if (!doc) return;
    const target = findNode(doc.nodes, id);
    if (!target) return;

    const duplicateWithNewIds = (node: SiteNode): SiteNode => ({
      ...node,
      id: `${node.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${node.name || node.type} (העתק)`,
      children: node.children ? node.children.map(duplicateWithNewIds) : undefined,
    });

    const cloned = duplicateWithNewIds(target);

    const insertClone = (nodes: SiteNode[]): SiteNode[] => {
      const res: SiteNode[] = [];
      for (const n of nodes) {
        res.push(n);
        if (n.id === id) {
          res.push(cloned);
        } else if (n.children) {
          n.children = insertClone(n.children);
        }
      }
      return res;
    };

    const newNodes = insertClone(doc.nodes);
    updateDocState({ ...doc, nodes: newNodes });
    setSelectedNodeId(cloned.id);
  };

  const handleDeleteNode = (id: string) => {
    if (!doc) return;
    const remove = (nodes: SiteNode[]): SiteNode[] => {
      return nodes
        .filter((n) => n.id !== id)
        .map((n) => (n.children ? { ...n, children: remove(n.children) } : n));
    };
    const newNodes = remove(doc.nodes);
    updateDocState({ ...doc, nodes: newNodes });
    setSelectedNodeId(null);
    setActiveTab("structure");
  };

  const handleAddNode = (type: SiteNode["type"], templateProps?: Record<string, any>) => {
    if (!doc) return;
    const newNode: SiteNode = {
      id: `${type}-${Date.now()}`,
      type,
      name:
        type === "heading"
          ? "כותרת חדשה"
          : type === "text"
          ? "פסקה חדשה"
          : type === "button"
          ? "כפתור"
          : type === "image"
          ? "תמונה"
          : type === "section"
          ? "אזור חדש"
          : "קונטיינר",
      classes:
        type === "section"
          ? "py-16 md:py-24 bg-white"
          : type === "container"
          ? "max-w-7xl mx-auto px-6"
          : type === "heading"
          ? "font-heading font-black text-3xl text-neutral-900 mb-4"
          : type === "text"
          ? "text-neutral-600 text-base leading-relaxed mb-6"
          : type === "button"
          ? "inline-block px-7 py-3.5 rounded-2xl bg-primary-500 text-white font-bold text-sm shadow-sm"
          : "",
      props: templateProps || {
        text: type === "heading" ? "כותרת חדשה לדוגמה" : type === "text" ? "טקסט פסקה חדש..." : "כפתור",
      },
    };

    // If an element is selected, add as sibling or inside container
    let newNodes = [...doc.nodes];
    if (selectedNode && (selectedNode.type === "section" || selectedNode.type === "container")) {
      newNodes = updateNode(doc.nodes, selectedNode.id, (parent) => ({
        ...parent,
        children: [...(parent.children || []), newNode],
      }));
    } else {
      // Add into root container or as new section
      newNodes.push(newNode);
    }

    updateDocState({ ...doc, nodes: newNodes });
    setSelectedNodeId(newNode.id);
    setActiveTab("element");
  };

  const handleUpdateNodeProp = (key: string, value: any) => {
    if (!doc || !selectedNodeId) return;
    const newNodes = updateNode(doc.nodes, selectedNodeId, (n) => ({
      ...n,
      props: { ...n.props, [key]: value },
    }));
    updateDocState({ ...doc, nodes: newNodes });
  };

  const handleUpdateNodeStyle = (property: string, value: any) => {
    if (!doc || !selectedNodeId) return;
    const newNodes = updateNode(doc.nodes, selectedNodeId, (n) => {
      const currentStyle = n.style || {};
      const baseStyle = currentStyle.base || {};
      const deviceStyle = baseStyle[device] || {};

      return {
        ...n,
        style: {
          ...currentStyle,
          base: {
            ...baseStyle,
            [device]: {
              ...deviceStyle,
              [property]: value,
            },
          },
        },
      };
    });
    updateDocState({ ...doc, nodes: newNodes });
  };

  // Viewport width styling
  const viewportWidth =
    device === "desktop" ? "100%" : device === "tablet" ? "1024px" : "390px";

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-neutral-900 text-neutral-100 font-sans select-none" dir="rtl">
      {/* 1. TOP CONTROL BAR */}
      <header className="h-14 bg-neutral-950 border-b border-neutral-800 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Back & Page Selector */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center text-xs transition-colors"
            title="חזרה ללוח הבקרה"
          >
            <i className="fas fa-arrow-right"></i>
          </Link>

          <select
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="page_home">דף הבית (עמוד ראשי)</option>
            <option value="page_adopt">עמוד אמץ אברך</option>
          </select>

          <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-md">
            {statusMessage}
          </span>
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-neutral-700">
          <button
            onClick={() => setDevice("desktop")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === "desktop" ? "bg-neutral-900 text-white shadow-xs" : "text-neutral-400 hover:text-white"
            }`}
            title="תצוגת מחשב"
          >
            <i className="fas fa-desktop"></i>
            <span className="hidden sm:inline">מחשב</span>
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === "tablet" ? "bg-neutral-900 text-white shadow-xs" : "text-neutral-400 hover:text-white"
            }`}
            title="תצוגת טאבלט (1024px)"
          >
            <i className="fas fa-tablet-screen-button"></i>
            <span className="hidden sm:inline">טאבלט</span>
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === "mobile" ? "bg-neutral-900 text-white shadow-xs" : "text-neutral-400 hover:text-white"
            }`}
            title="תצוגת טלפון (390px)"
          >
            <i className="fas fa-mobile-screen-button"></i>
            <span className="hidden sm:inline">טלפון</span>
          </button>
        </div>

        {/* Right: Undo/Redo & Publish */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-800/70 p-1 rounded-xl mr-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="w-7 h-7 rounded-lg hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs transition-colors"
              title="בטל פעולה (Undo)"
            >
              <i className="fas fa-rotate-left"></i>
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="w-7 h-7 rounded-lg hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs transition-colors"
              title="בצע שוב (Redo)"
            >
              <i className="fas fa-rotate-right"></i>
            </button>
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isPublishing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
            <span>פרסם עמוד</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY: PREVIEW + SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER PREVIEW VIEWPORT */}
        <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4 overflow-hidden relative">
          <div
            className="h-full bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border border-neutral-800 flex flex-col"
            style={{ width: viewportWidth }}
          >
            <iframe
              ref={iframeRef}
              src={`/admin/editor/preview?docId=${docId}`}
              className="w-full h-full border-0 bg-white"
              title="Live Visual Preview"
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL */}
        <aside className="w-80 sm:w-96 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 z-20">
          {/* Side Panel Tabs */}
          <div className="grid grid-cols-4 border-b border-neutral-800 bg-neutral-950 text-xs font-bold">
            {[
              { id: "structure", label: "מבנה", icon: "fa-bars-staggered" },
              { id: "add", label: "הוספה", icon: "fa-plus" },
              { id: "element", label: "אלמנט", icon: "fa-sliders" },
              { id: "page", label: "עמוד", icon: "fa-file-lines" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "text-primary-400 border-b-2 border-primary-500 bg-neutral-900"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <i className={`fas ${tab.icon} text-xs`}></i>
                <span className="text-[11px]">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Side Panel Content Body */}
          <div className="flex-1 overflow-y-auto p-5 text-xs space-y-6">
            {/* 1. STRUCTURE TAB */}
            {activeTab === "structure" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-bold text-neutral-400">עץ אלמנטים (Document Tree)</span>
                  <span className="text-[10px] text-neutral-500">{doc?.nodes.length || 0} אלמנטים ראשיים</span>
                </div>

                {doc?.nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <div
                      key={node.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-neutral-800 border-primary-500 text-white"
                          : "bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setActiveTab("element");
                        }}
                      >
                        <div className="flex items-center gap-2 font-bold truncate">
                          <i
                            className={`fas ${
                              node.type === "section"
                                ? "fa-cube text-primary-400"
                                : node.type === "container"
                                ? "fa-box-open text-amber-400"
                                : node.type === "heading"
                                ? "fa-heading text-emerald-400"
                                : "fa-font text-neutral-400"
                            } text-xs`}
                          ></i>
                          <span className="truncate">{node.name || node.type}</span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDuplicateNode(node.id)}
                            className="w-6 h-6 rounded hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-[10px]"
                            title="שכפל"
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="w-6 h-6 rounded hover:bg-rose-900/50 text-neutral-400 hover:text-rose-400 flex items-center justify-center text-[10px]"
                            title="מחק"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>

                      {/* Child nodes preview */}
                      {node.children && node.children.length > 0 && (
                        <div className="mt-2 pr-4 border-r border-neutral-800 space-y-1.5">
                          {node.children.map((child) => (
                            <div
                              key={child.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNodeId(child.id);
                                setActiveTab("element");
                              }}
                              className={`p-2 rounded-lg flex items-center justify-between text-[11px] cursor-pointer ${
                                selectedNodeId === child.id
                                  ? "bg-primary-500/20 text-primary-300 border border-primary-500/40"
                                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400"
                              }`}
                            >
                              <span className="truncate">{child.name || child.type}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateNode(child.id);
                                  }}
                                  className="w-5 h-5 rounded hover:bg-neutral-700 flex items-center justify-center text-[9px]"
                                >
                                  <i className="fas fa-copy"></i>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNode(child.id);
                                  }}
                                  className="w-5 h-5 rounded hover:bg-rose-900/50 text-neutral-400 hover:text-rose-400 flex items-center justify-center text-[9px]"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. ADD TAB (Component Library) */}
            {activeTab === "add" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-neutral-400 mb-3 text-[11px] uppercase tracking-wider">
                    מבנה ומכולות
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleAddNode("section")}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-primary-500 text-right space-y-1 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-cube text-primary-400 text-sm"></i>
                      <div className="font-bold text-neutral-200">אזור (Section)</div>
                      <div className="text-[10px] text-neutral-500">בלוק ברוחב מלא עם ריווח</div>
                    </button>
                    <button
                      onClick={() => handleAddNode("container")}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-amber-500 text-right space-y-1 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-box-open text-amber-400 text-sm"></i>
                      <div className="font-bold text-neutral-200">קונטיינר</div>
                      <div className="text-[10px] text-neutral-500">מכולה מיושרת ברוחב התוכן</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-400 mb-3 text-[11px] uppercase tracking-wider">
                    אלמנטים בסיסיים
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleAddNode("heading")}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-emerald-500 text-right space-y-1 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-heading text-emerald-400 text-sm"></i>
                      <div className="font-bold text-neutral-200">כותרת (H1-H4)</div>
                    </button>
                    <button
                      onClick={() => handleAddNode("text")}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-emerald-500 text-right space-y-1 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-paragraph text-emerald-400 text-sm"></i>
                      <div className="font-bold text-neutral-200">פסקה / טקסט</div>
                    </button>
                    <button
                      onClick={() => handleAddNode("button")}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-primary-500 text-right space-y-1 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-hand-pointer text-primary-400 text-sm"></i>
                      <div className="font-bold text-neutral-200">כפתור לחיץ</div>
                    </button>
                    <button
                      onClick={() => handleAddNode("image", { src: "/images/safed.jpg", alt: "תמונה לדוגמה" })}
                      className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 hover:border-primary-500 text-right space-y-1 transition-colors cursor-pointer"
                    >
                      <i className="fas fa-image text-primary-400 text-sm"></i>
                      <div className="font-bold text-neutral-200">תמונה</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ELEMENT TAB (Properties & Styles) */}
            {activeTab === "element" && (
              <div className="space-y-6">
                {!selectedNode ? (
                  <div className="p-8 text-center text-neutral-500 font-bold space-y-2">
                    <i className="fas fa-arrow-pointer text-2xl text-neutral-600 block"></i>
                    <span>בחר אלמנט בתצוגה או בעץ כדי לערוך את מאפייניו</span>
                  </div>
                ) : (
                  <>
                    {/* Element header & sub-tabs */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <div>
                        <span className="font-bold text-white block">{selectedNode.name || selectedNode.type}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">#{selectedNode.id}</span>
                      </div>
                      <div className="flex bg-neutral-950 p-1 rounded-xl">
                        <button
                          onClick={() => setElementSubTab("content")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                            elementSubTab === "content" ? "bg-neutral-800 text-white" : "text-neutral-500"
                          }`}
                        >
                          תוכן
                        </button>
                        <button
                          onClick={() => setElementSubTab("style")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                            elementSubTab === "style" ? "bg-neutral-800 text-white" : "text-neutral-500"
                          }`}
                        >
                          עיצוב
                        </button>
                      </div>
                    </div>

                    {/* Content Sub-tab */}
                    {elementSubTab === "content" && (
                      <div className="space-y-4">
                        {/* Text */}
                        {(selectedNode.type === "heading" || selectedNode.type === "text" || selectedNode.type === "button") && (
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-neutral-400">טקסט האלמנט</label>
                            <textarea
                              rows={3}
                              value={selectedNode.props?.text || ""}
                              onChange={(e) => handleUpdateNodeProp("text", e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl p-3 text-xs text-neutral-100 focus:outline-none"
                            ></textarea>
                          </div>
                        )}

                        {/* Button Link */}
                        {selectedNode.type === "button" && (
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-neutral-400">כתובת יעד (URL)</label>
                            <input
                              type="text"
                              value={selectedNode.props?.href || ""}
                              onChange={(e) => handleUpdateNodeProp("href", e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                              dir="ltr"
                            />
                          </div>
                        )}

                        {/* Image Source */}
                        {selectedNode.type === "image" && (
                          <>
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-neutral-400">נתיב תמונה (URL)</label>
                              <input
                                type="text"
                                value={selectedNode.props?.src || ""}
                                onChange={(e) => handleUpdateNodeProp("src", e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                                dir="ltr"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-bold text-neutral-400">טקסט חלופי (Alt)</label>
                              <input
                                type="text"
                                value={selectedNode.props?.alt || ""}
                                onChange={(e) => handleUpdateNodeProp("alt", e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Style Sub-tab */}
                    {elementSubTab === "style" && (
                      <div className="space-y-5">
                        <div className="text-[10px] font-bold text-primary-400 bg-primary-500/10 p-2 rounded-lg">
                          עורכים עכשיו סגנון עבור: {device === "desktop" ? "מחשב" : device === "tablet" ? "טאבלט" : "טלפון"}
                        </div>

                        {/* Text Align */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-neutral-400">יישור טקסט</label>
                          <div className="grid grid-cols-3 gap-1 bg-neutral-950 p-1 rounded-xl">
                            {["right", "center", "left"].map((align) => (
                              <button
                                key={align}
                                onClick={() => handleUpdateNodeStyle("textAlign", align)}
                                className="py-1.5 rounded-lg text-xs hover:bg-neutral-800 text-neutral-300"
                              >
                                <i className={`fas fa-align-${align}`}></i>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Swatches */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-neutral-400">צבע טקסט (צבעי מותג)</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "כחול ראשי", hex: "#1f84ee" },
                              { label: "כחול כהה", hex: "#1167cc" },
                              { label: "כתום הדגשה", hex: "#f97316" },
                              { label: "טקסט כהה", hex: "#12171f" },
                              { label: "אפור משני", hex: "#627188" },
                              { label: "לבן", hex: "#ffffff" },
                            ].map((c) => (
                              <button
                                key={c.hex}
                                onClick={() => handleUpdateNodeStyle("color", c.hex)}
                                style={{ backgroundColor: c.hex }}
                                className="w-7 h-7 rounded-full border border-neutral-700 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                                title={c.label}
                              ></button>
                            ))}
                          </div>
                        </div>

                        {/* Border Radius Presets */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-neutral-400">פינות מעוגלות</label>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            {[
                              { label: "ללא", val: "0px" },
                              { label: "8px", val: "8px" },
                              { label: "16px", val: "16px" },
                              { label: "עגול", val: "9999px" },
                            ].map((r) => (
                              <button
                                key={r.val}
                                onClick={() => handleUpdateNodeStyle("borderRadius", r.val)}
                                className="p-2 bg-neutral-950 hover:bg-neutral-800 rounded-lg text-[10px] font-bold text-neutral-300"
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 4. PAGE TAB (SEO & Meta) */}
            {activeTab === "page" && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-400">שם העמוד</label>
                  <input
                    type="text"
                    value={doc?.title || ""}
                    onChange={(e) => doc && updateDocState({ ...doc, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-neutral-400">כתובת העמוד (Path)</label>
                  <input
                    type="text"
                    value={doc?.path || "/"}
                    onChange={(e) => doc && updateDocState({ ...doc, path: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-primary-500 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                {/* Google SERP Preview */}
                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  <span className="block text-[11px] font-bold text-neutral-400">תצוגה מקדימה בגוגל (SERP)</span>
                  <div className="p-4 bg-white rounded-xl text-right font-sans text-neutral-900 shadow-sm border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 block truncate" dir="ltr">
                      https://torah-laneshma.co.il{doc?.path || "/"}
                    </span>
                    <h5 className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer truncate mt-0.5">
                      {doc?.title || "דף הבית · תורה לנשמה"}
                    </h5>
                    <p className="text-[11px] text-[#4d5156] line-clamp-2 mt-1 leading-normal">
                      מיזם חברותא טלפונית ללימוד תורה וחיבור אנושי פתוח ומכבד. הצטרפו לשעה שבועית של לימוד משותף בגובה העיניים.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
