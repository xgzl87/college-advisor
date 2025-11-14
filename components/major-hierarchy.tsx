"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import type { Major } from "@/lib/majors-data"

interface MajorHierarchyProps {
  majors: Major[]
  onSelectMajor?: (major: Major) => void
}

interface HierarchyNode {
  major: Major
  children: HierarchyNode[]
}

function buildTree(majors: Major[]): HierarchyNode[] {
  const nodeMap = new Map<string, HierarchyNode>()
  const roots: HierarchyNode[] = []

  // Create nodes for all majors
  majors.forEach((major) => {
    nodeMap.set(major.code.toString(), {
      major,
      children: [],
    })
  })

  // Build tree structure
  majors.forEach((major) => {
    const node = nodeMap.get(major.code.toString())!

    if (major.parent_id === "0" || major.parent_id === "" || !nodeMap.has(major.parent_id)) {
      roots.push(node)
    } else {
      const parent = nodeMap.get(major.parent_id)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return roots
}

function TreeNode({
  node,
  depth = 0,
  onSelectMajor,
}: {
  node: HierarchyNode
  depth?: number
  onSelectMajor?: (major: Major) => void
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2)
  const hasChildren = node.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    onSelectMajor?.(node.major)
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors ${
          depth > 0 ? "ml-" + (depth * 4) : ""
        }`}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )
        ) : (
          <div className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="text-sm">{node.major.name}</span>
        <span className="text-xs text-muted-foreground ml-auto">({node.major.code})</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.major.code} node={child} depth={depth + 1} onSelectMajor={onSelectMajor} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MajorHierarchy({ majors, onSelectMajor }: MajorHierarchyProps) {
  const tree = buildTree(majors)

  if (majors.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无数据</div>
  }

  return (
    <div className="space-y-1">
      {tree.map((node) => (
        <TreeNode key={node.major.code} node={node} onSelectMajor={onSelectMajor} />
      ))}
    </div>
  )
}
