"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Plus, Minus } from "lucide-react"
import type { MajorNode } from "@/lib/education-data"

interface MajorTreeProps {
  nodes: MajorNode[]
  onSelectMajor?: (major: MajorNode) => void
  selectedMajorId?: number
  searchQuery?: string
}

function TreeNode({
  node,
  depth = 0,
  onSelectMajor,
  selectedMajorId,
  searchQuery,
}: {
  node: MajorNode
  depth?: number
  onSelectMajor?: (major: MajorNode) => void
  selectedMajorId?: number
  searchQuery?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedMajorId === node.id

  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setIsExpanded(true)
    }
  }, [searchQuery])

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    onSelectMajor?.(node)
  }

  const getLevelStyles = () => {
    switch (node.level) {
      case 1: // 门类
        return "text-sm font-bold"
      case 2: // 专业类
        return "text-xs font-semibold"
      case 3: // 专业
        return "text-xs font-normal"
      default:
        return "text-xs"
    }
  }

  const getExpandIcon = () => {
    if (!hasChildren) {
      return <div className="w-4 h-4 flex-shrink-0" />
    }

    // Level 2 uses Plus/Minus icons
    if (node.level === 2) {
      return isExpanded ? (
        <Minus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      ) : (
        <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )
    }

    // Other levels use Chevron icons
    return isExpanded ? (
      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    ) : (
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    )
  }

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
          isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
        }`}
        onClick={handleClick}
      >
        {getExpandIcon()}
        <span className={`${getLevelStyles()} flex-1 leading-tight`}>{node.name}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelectMajor={onSelectMajor}
              selectedMajorId={selectedMajorId}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function MajorTree({ nodes, onSelectMajor, selectedMajorId, searchQuery }: MajorTreeProps) {
  if (!nodes || nodes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{searchQuery ? "未找到匹配的专业" : "暂无数据"}</div>
  }

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onSelectMajor={onSelectMajor}
          selectedMajorId={selectedMajorId}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  )
}
