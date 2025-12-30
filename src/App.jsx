import React, { useState, useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { initialData } from "./data";
import Modal from "./components/UI/Modal";

if (typeof window !== "undefined") {
  cytoscape.use(dagre);
}

const STORAGE_KEY = "mindmap-data";

// Load data from localStorage or use initialData
const loadInitialData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Validate that the data has the expected structure
      if (parsedData.nodes && parsedData.edges && parsedData.hierarchy) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return initialData;
};

const App = () => {
  const [data, setData] = useState(loadInitialData);
  const [theme, setTheme] = useState(
    localStorage.getItem("preferred-theme") || "dark"
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    target: null,
    type: "node",
  });

  // Connection State
  const [connectionMode, setConnectionMode] = useState({
    active: false,
    sourceNode: null,
  });

  // Modal States
  const [modal, setModal] = useState({
    isOpen: false,
    type: "add", // add, rename, edit-desc, remove
    title: "",
    inputValue: "",
    inputDesc: "",
    targetNode: null,
    position: null,
  });

  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const connectionModeRef = useRef(connectionMode);
  const dataRef = useRef(data);

  useEffect(() => {
    connectionModeRef.current = connectionMode;
  }, [connectionMode]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // Handle quota exceeded or other localStorage errors
      if (error.name === "QuotaExceededError") {
        alert("Storage quota exceeded. Your changes may not be saved.");
      }
    }
  }, [data]);

  // --- Helper Methods ---
  const getTopLevelNodes = useCallback(() => {
    const childrenSet = new Set();
    Object.values(data.hierarchy).forEach((children) => {
      children.forEach((id) => childrenSet.add(id));
    });
    return data.nodes
      .filter((node) => !childrenSet.has(node.id))
      .map((node) => node.id);
  }, [data.hierarchy, data.nodes]);

  const calculateMaxLevel = useCallback(() => {
    const getNodeLevel = (nodeId, level = 0) => {
      const children = data.hierarchy[nodeId];
      if (!children || children.length === 0) return level;
      let maxChildLevel = level;
      children.forEach((childId) => {
        maxChildLevel = Math.max(
          maxChildLevel,
          getNodeLevel(childId, level + 1)
        );
      });
      return maxChildLevel;
    };

    const topLevelNodes = getTopLevelNodes();
    let maxLvl = 0;
    topLevelNodes.forEach((nodeId) => {
      maxLvl = Math.max(maxLvl, getNodeLevel(nodeId, 0));
    });
    setMaxLevel(maxLvl);
  }, [data.hierarchy, getTopLevelNodes]);

  const getStylesheet = useCallback(
    () => [
      {
        selector: "node",
        style: {
          "background-color": "#66BB6A",
          label: "data(label)",
          "text-valign": "center",
          "text-halign": "center",
          color: "#fff",
          "font-size": "11px",
          "font-weight": "600",
          "font-family": "Inter, sans-serif",
          width: "85px",
          height: "85px",
          "border-width": "2px",
          "border-color": "#4CAF50",
          "text-wrap": "wrap",
          "text-max-width": "80px",
          "overlay-opacity": 0,
          "transition-property": "background-color, border-color, border-width",
          "transition-duration": "0.3s",
          shape: "round-rectangle",
        },
      },
      {
        selector: "node.root",
        style: {
          "background-color": "#2196F3",
          "border-color": "#1976D2",
          width: "100px",
          height: "100px",
          "font-size": "12px",
        },
      },
      {
        selector: "node.category",
        style: {
          "background-color": "#9C27B0",
          "border-color": "#7B1FA2",
        },
      },
      {
        selector: "node.highlighted",
        style: {
          "border-width": "3px",
          "border-color": "#FFC107",
        },
      },
      {
        selector: "node:selected",
        style: {
          "border-width": "4px",
          "border-color": "#333",
        },
      },
      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          "line-color": "#666666",
          "target-arrow-color": "#666666",
          width: "3px",
          "target-arrow-size": "15px",
          "arrow-scale": 1.5,
          opacity: 1,
          "transition-property":
            "line-color, target-arrow-color, width, opacity",
          "transition-duration": "0.3s",
        },
      },
      {
        selector: "edge.highlighted",
        style: {
          "line-color": "#FFC107",
          "target-arrow-color": "#FFC107",
          width: "3px",
        },
      },
      {
        selector: ".hidden",
        style: {
          display: "none",
        },
      },
    ],
    []
  );

  const applyLayout = useCallback(() => {
    if (!cyRef.current) return;
    const layout = cyRef.current.layout({
      name: "dagre",
      rankDir: "TB",
      nodeSep: 50,
      rankSep: 100,
      padding: 50,
      animate: true,
      animationDuration: 500,
    });
    layout.run();
  }, []);

  // --- Actions ---
  const expandAll = () => {
    if (!cyRef.current) return;
    cyRef.current.nodes().removeClass("hidden");
    setTimeout(applyLayout, 100);
  };

  const collapseAll = () => {
    if (!cyRef.current) return;
    const topLevelNodes = getTopLevelNodes();
    cyRef.current.nodes().addClass("hidden");
    topLevelNodes.forEach((id) => {
      cyRef.current.getElementById(id).removeClass("hidden");
    });
    setCurrentLevel(0);
    applyLayout();
  };

  const drillDown = () => {
    if (currentLevel >= maxLevel) return;
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    showNodesUpToLevel(nextLevel);
  };

  const drillUp = () => {
    if (currentLevel <= 0) return;
    const prevLevel = currentLevel - 1;
    setCurrentLevel(prevLevel);
    showNodesUpToLevel(prevLevel);
  };

  const showNodesUpToLevel = (targetLevel) => {
    if (!cyRef.current) return;
    cyRef.current.nodes().addClass("hidden");

    const showNodeAndAncestors = (nodeId, level = 0) => {
      if (level <= targetLevel) {
        const node = cyRef.current.getElementById(nodeId);
        if (node.length > 0) node.removeClass("hidden");

        if (level < targetLevel) {
          const children = data.hierarchy[nodeId] || [];
          children.forEach((childId) =>
            showNodeAndAncestors(childId, level + 1)
          );
        }
      }
    };

    getTopLevelNodes().forEach((id) => showNodeAndAncestors(id, 0));
    applyLayout();
  };

  const fitView = () => {
    if (!cyRef.current) return;
    const visibleElements = cyRef.current
      .elements()
      .filter((ele) => !ele.hasClass("hidden"));
    cyRef.current.fit(visibleElements, 50);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("preferred-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Export functions
  const exportAsJSON = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindmap-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert("Failed to export JSON. Please try again.");
    }
  };

  const exportAsPNG = () => {
    if (!cyRef.current) {
      alert("Graph not ready. Please try again.");
      return;
    }
    try {
      const pngData = cyRef.current.png({
        output: "blob",
        bg: theme === "light" ? "#ffffff" : "#1a1a1a",
        full: true,
        scale: 2,
      });
      const url = URL.createObjectURL(pngData);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindmap-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PNG:", error);
      alert("Failed to export PNG. Please try again.");
    }
  };

  // --- Initialization ---
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = [
      ...data.nodes.map((node) => ({
        group: "nodes",
        data: { id: node.id, ...node.data },
        classes: node.data.type || "default",
      })),
      ...data.edges.map((edge) => ({
        group: "edges",
        data: { ...edge },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: getStylesheet(),
      layout: { name: "grid" },
      minZoom: 0.1,
      maxZoom: 3,
      wheelSensitivity: 0.2,
    });

    cyRef.current = cy;

    // Event Handlers
    cy.on("mouseover", "node", (e) => {
      const node = e.target;
      node.addClass("highlighted");
      node.connectedEdges().addClass("highlighted");
      setHoveredNode({
        ...node.data(),
        connections: node.degree(),
      });
    });

    cy.on("mouseout", "node", (e) => {
      const node = e.target;
      node.removeClass("highlighted");
      cy.edges().removeClass("highlighted");
      setHoveredNode(null);
    });

    cy.on("tap", "node", (e) => {
      const node = e.target;

      if (connectionModeRef.current.active) {
        handleCompleteConnection(node);
        return;
      }

      setSelectedNode(node.data());

      // Handle Drill Down on Click if has children
      const children = dataRef.current.hierarchy[node.id()];
      if (children && children.length > 0) {
        const firstChild = cy.getElementById(children[0]);
        if (firstChild.hasClass("hidden")) {
          children.forEach((id) => cy.getElementById(id).removeClass("hidden"));
        } else {
          // Recursive hide
          const hideRecursive = (id) => {
            cy.getElementById(id).addClass("hidden");
            (dataRef.current.hierarchy[id] || []).forEach(hideRecursive);
          };
          children.forEach(hideRecursive);
        }
        applyLayout();
      }
    });

    cy.on("cxttap", "node", (e) => {
      e.originalEvent.preventDefault();
      const node = e.target;
      setContextMenu({
        visible: true,
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
        target: node,
        type: "node",
      });
    });

    cy.on("cxttap", (e) => {
      if (e.target === cy) {
        e.originalEvent.preventDefault();
        setContextMenu({
          visible: true,
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
          target: null,
          type: "bg",
        });
      }
    });

    cy.on("tap", (e) => {
      if (e.target === cy) {
        setSelectedNode(null);
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    });

    calculateMaxLevel();
    collapseAll();

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // --- Modal Logic ---
  const openModal = (type, targetNode = null, position = null) => {
    setModal({
      isOpen: true,
      type,
      title:
        type === "add"
          ? "Add New Node"
          : type === "rename"
          ? "Rename Node"
          : type === "edit-desc"
          ? "Edit Description"
          : "Remove Node",
      inputValue: type === "rename" ? targetNode.data("label") : "",
      inputDesc: type === "edit-desc" ? targetNode.data("summary") : "",
      targetNode,
      position,
    });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleModalConfirm = () => {
    const { type, targetNode, inputValue, inputDesc, position } = modal;

    if (type === "add" || type === "add-child") {
      const id = `node_${Date.now()}`;
      const newNode = {
        id,
        data: {
          label: inputValue || "New Node",
          type: "component",
          summary: inputDesc || "A new added node.",
        },
      };

      setData((prev) => {
        const newData = {
          ...prev,
          nodes: [...prev.nodes, newNode],
          hierarchy: { ...prev.hierarchy, [id]: [] },
          edges: [...prev.edges],
        };

        if (type === "add-child" && targetNode) {
          const parentId = targetNode.id();
          newData.hierarchy[parentId] = [
            ...(prev.hierarchy[parentId] || []),
            id,
          ];
          newData.edges.push({
            id: `e_${parentId}_${id}`,
            source: parentId,
            target: id,
            type: "hierarchy",
          });
        }

        return newData;
      });

      if (cyRef.current) {
        cyRef.current.add({
          group: "nodes",
          data: { id, ...newNode.data },
          position: position || { x: 0, y: 0 },
          classes: "component",
        });

        if (type === "add-child" && targetNode) {
          cyRef.current.add({
            group: "edges",
            data: {
              id: `e_${targetNode.id()}_${id}`,
              source: targetNode.id(),
              target: id,
              type: "hierarchy",
            },
          });
        }

        if (!position) applyLayout();
      }
    } else if (type === "rename") {
      if (inputValue) {
        targetNode.data("label", inputValue);
        setData((prev) => ({
          ...prev,
          nodes: prev.nodes.map((n) =>
            n.id === targetNode.id()
              ? { ...n, data: { ...n.data, label: inputValue } }
              : n
          ),
        }));
      }
    } else if (type === "edit-desc") {
      targetNode.data("summary", inputDesc);
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === targetNode.id()
            ? { ...n, data: { ...n.data, summary: inputDesc } }
            : n
        ),
      }));
    } else if (type === "remove") {
      const id = targetNode.id();
      targetNode.remove();
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((n) => n.id !== id),
        edges: prev.edges.filter((e) => e.source !== id && e.target !== id),
      }));
      if (selectedNode?.id === id) setSelectedNode(null);
    }

    closeModal();
  };

  const handleStartConnection = (node) => {
    setConnectionMode({ active: true, sourceNode: node });
    setContextMenu((prev) => ({ ...prev, visible: false }));
    // Dim other nodes to show we are in connection mode
    if (cyRef.current) {
      cyRef.current.elements().addClass("dimmed");
      node.removeClass("dimmed").addClass("highlighted");
    }
  };

  const handleCompleteConnection = (targetNode) => {
    const sourceNode = connectionModeRef.current.sourceNode;

    if (!sourceNode) return;

    if (sourceNode.id() === targetNode.id()) {
      alert("Cannot connect a node to itself.");
      return;
    }

    const edgeId = `e_${sourceNode.id()}_${targetNode.id()}`;

    // Check if edge already exists
    if (cyRef.current.getElementById(edgeId).length > 0) {
      alert("Connection already exists.");
      return;
    }

    const newEdge = {
      id: edgeId,
      source: sourceNode.id(),
      target: targetNode.id(),
      type: "connects",
    };

    setData((prev) => ({
      ...prev,
      edges: [...prev.edges, newEdge],
      hierarchy: {
        ...prev.hierarchy,
        [sourceNode.id()]: [
          ...(prev.hierarchy[sourceNode.id()] || []),
          targetNode.id(),
        ],
      },
    }));

    if (cyRef.current) {
      cyRef.current.add({
        group: "edges",
        data: newEdge,
      });
      cyRef.current.elements().removeClass("highlighted");
      cyRef.current.elements().removeClass("dimmed");
    }

    setConnectionMode({ active: false, sourceNode: null });
  };

  const handleAddNodeAtPos = () => {
    const pan = cyRef.current.pan();
    const zoom = cyRef.current.zoom();
    const rect = containerRef.current.getBoundingClientRect();

    const pos = {
      x: (contextMenu.x - rect.left - pan.x) / zoom,
      y: (contextMenu.y - rect.top - pan.y) / zoom,
    };

    openModal("add", null, pos);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-(--bg-secondary) text-(--text-primary) transition-colors duration-200">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-2000 w-12 h-12 rounded-full bg-(--bg-primary) border-2 border-(--border-color) flex items-center justify-center cursor-pointer shadow-md hover:scale-110 hover:bg-primary hover:text-white transition-all duration-200 text-xl"
        title="Toggle Theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Main Graph Area */}
      <div className="relative w-full lg:w-[70%] h-[60vh] lg:h-full bg-(--bg-primary) border-r-2 border-(--border-color)">
        {/* Controls */}
        <div className="absolute top-6 left-6 right-20 z-1000 flex flex-wrap gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
          >
            📂 Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 rounded-lg bg-secondary text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
          >
            📁 Collapse All
          </button>
          <button
            onClick={drillDown}
            className="px-4 py-2 rounded-lg bg-info text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
          >
            ⬇️ Drill Down
          </button>
          <button
            onClick={drillUp}
            className="px-4 py-2 rounded-lg bg-info text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
          >
            ⬆️ Drill Up
          </button>
          <button
            onClick={fitView}
            className="px-4 py-2 rounded-lg bg-info text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
          >
            🎯 Fit View
          </button>
          <button
            onClick={() => openModal("add")}
            className="px-4 py-2 rounded-lg bg-success text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
          >
            ➕ Add Node
          </button>
          <button
            onClick={exportAsJSON}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
            title="Download mindmap as JSON"
          >
            📥 Download JSON
          </button>
          <button
            onClick={exportAsPNG}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:-translate-y-px hover:shadow-md transition-all cursor-pointer"
            title="Download mindmap as PNG image"
          >
            📸 Download PNG
          </button>
        </div>

        {connectionMode.active && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-2000 bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-bounce">
            <span className="font-bold tracking-wide">
              🔗 Select a target node to connect...
            </span>
            <button
              onClick={() => {
                setConnectionMode({ active: false, sourceNode: null });
                if (cyRef.current) {
                  cyRef.current.elements().removeClass("dimmed");
                  cyRef.current.elements().removeClass("highlighted");
                }
              }}
              className="bg-white/20 hover:bg-white/40 px-3 py-1 rounded-full text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        <div id="cy" ref={containerRef} className="w-full h-full"></div>

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            className="fixed z-10000 w-56 bg-white/95 dark:bg-slate-800/95 border border-(--border-color) rounded-xl shadow-2xl overflow-hidden animate-fade-in backdrop-blur-md"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {contextMenu.type === "node" ? (
              <>
                <div
                  onClick={() => openModal("add-child", contextMenu.target)}
                  className="px-4 py-3 cursor-pointer hover:bg-primary/10 hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  ➕ Add Child
                </div>
                <div
                  onClick={() => handleStartConnection(contextMenu.target)}
                  className="px-4 py-3 cursor-pointer hover:bg-primary/10 hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  🔗 Connect to...
                </div>
                <div
                  onClick={() => openModal("rename", contextMenu.target)}
                  className="px-4 py-3 cursor-pointer hover:bg-primary/10 hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  ✏️ Rename
                </div>
                <div
                  onClick={() => openModal("edit-desc", contextMenu.target)}
                  className="px-4 py-3 cursor-pointer hover:bg-primary/10 hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  📝 Edit Description
                </div>
                <div
                  onClick={() => openModal("remove", contextMenu.target)}
                  className="px-4 py-3 cursor-pointer hover:bg-red-500/10 text-red-500 font-medium flex items-center gap-3 transition-colors"
                >
                  🗑️ Remove Node
                </div>
              </>
            ) : (
              <div
                onClick={handleAddNodeAtPos}
                className="px-4 py-3 cursor-pointer hover:bg-primary/10 hover:text-primary flex items-center gap-3 font-medium transition-colors"
              >
                ➕ Add New Node
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[30%] h-[40vh] lg:h-full bg-(--bg-secondary) border-l border-(--border-color) p-4 overflow-y-auto sidebar-scroll">
        <div className="mb-6 p-4 rounded-md bg-primary text-white shadow-lg">
          <h2 className="text-xl font-bold mb-1">Architecture Explorer</h2>
          <p className="text-xs opacity-90">{data.metadata.topic}</p>
        </div>

        <div className="bg-(--bg-primary) border-(--border-color) text-xs text-(--text-tertiary) mb-4 rounded-lg flex items-center gap-2 p-4">
          <span className="text-primary font-medium">Root</span>
          {selectedNode && (
            <>
              <span>{">"}</span>
              <span className="text-primary font-medium">
                {selectedNode.label}
              </span>
            </>
          )}
        </div>

        {selectedNode ? (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-(--bg-primary) rounded-2xl border border-(--border-color) shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold rounded-md">
                  {selectedNode.type || "Component"}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-indigo-500 mb-4">
                {selectedNode.label}
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-(--text-tertiary) mb-1 block">
                    Description
                  </span>
                  <p className="text-sm text-(--text-secondary) leading-relaxed text-justify">
                    {selectedNode.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-4xl animate-pulse">
              🔍
            </div>
            <h3 className="text-xl font-bold text-(--text-primary) mb-2">
              Component Explorer
            </h3>
            <p className="text-sm text-(--text-tertiary) leading-relaxed">
              Select or hover over a node in the graph to explore its
              architecture, dependencies, and internal logic.
            </p>
          </div>
        )}

        {hoveredNode && !selectedNode && (
          <div className="mt-4 p-4 bg-(--bg-primary) rounded-xl border border-(--border-color) shadow-lg animate-fade-in relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                Previewing
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full">
                <span className="text-[10px] font-bold text-primary">
                  {hoveredNode.connections || 0} Connections
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              </div>
            </div>
            <h4 className="font-bold text-sm mb-2 text-(--text-primary)">
              {hoveredNode.label}
            </h4>
            <p className="text-xs text-(--text-tertiary) line-clamp-3 leading-relaxed">
              {hoveredNode.summary}
            </p>
          </div>
        )}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
        confirmText={
          modal.type === "remove"
            ? "Delete"
            : modal.type === "add"
            ? "Add Node"
            : "Save"
        }
        type={modal.type === "remove" ? "danger" : "primary"}
      >
        <div className="space-y-4">
          {(modal.type === "add" || modal.type === "rename") && (
            <div>
              <label className="block text-xs font-bold text-(--text-tertiary) uppercase tracking-wider mb-2">
                Node Label
              </label>
              <input
                type="text"
                value={modal.inputValue}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, inputValue: e.target.value }))
                }
                className="w-full px-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-lg text-(--text-primary) focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter label..."
                autoFocus
              />
            </div>
          )}
          {(modal.type === "add" || modal.type === "edit-desc") && (
            <div>
              <label className="block text-xs font-bold text-(--text-tertiary) uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={modal.inputDesc}
                onChange={(e) =>
                  setModal((prev) => ({ ...prev, inputDesc: e.target.value }))
                }
                className="w-full px-4 py-2 bg-(--bg-secondary) border border-(--border-color) rounded-lg text-(--text-primary) focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                placeholder="Enter description..."
              />
            </div>
          )}
          {modal.type === "remove" && (
            <p className="text-(--text-secondary)">
              Are you sure you want to delete{" "}
              <span className="font-bold text-(--text-primary)">
                {modal.targetNode?.data("label")}
              </span>
              ? This action cannot be undone.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default App;
