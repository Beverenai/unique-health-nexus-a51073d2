
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HealthSystemItem } from '@/services/healthSystemService';
import { HealthIssue } from '@/types/supabase';
import { categorizeSystem } from '@/components/health/SystemCategories';
import SystemIcon from '@/components/health/SystemIcon';

interface SystemRelationshipDiagramProps {
  systems: HealthSystemItem[];
  currentIssue?: HealthIssue;
  getSystemImpact: (system: HealthSystemItem) => 'high' | 'medium' | 'low';
}

const SystemRelationshipDiagram: React.FC<SystemRelationshipDiagramProps> = ({
  systems,
  currentIssue,
  getSystemImpact
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height: 240 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Group systems by category to organize them better visually
  const categoryGroups = systems.reduce<Record<string, HealthSystemItem[]>>(
    (acc, system) => {
      const category = categorizeSystem(system.area);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(system);
      return acc;
    },
    {}
  );
  
  // Take the first 5 categories to avoid overcrowding
  const categories = Object.keys(categoryGroups).slice(0, 5);
  
  // Filter to show only highest impact systems from each category
  const topSystems = categories.flatMap(category => {
    const systemsInCategory = categoryGroups[category];
    if (!systemsInCategory) return [];
    
    // Sort by impact and take top 1-2 from each category
    return systemsInCategory
      .sort((a, b) => {
        const impactA = getSystemImpact(a);
        const impactB = getSystemImpact(b);
        
        const impactScore = { 'high': 3, 'medium': 2, 'low': 1 };
        return impactScore[impactB] - impactScore[impactA];
      })
      .slice(0, 2);
  });
  
  // Calculate node positions in a circular layout
  const getNodePositions = () => {
    if (!dimensions.width) return [];
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    
    const nodePositions = topSystems.map((system, index) => {
      const angle = (index / topSystems.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return { 
        system, 
        x, 
        y, 
        impact: getSystemImpact(system) 
      };
    });
    
    return nodePositions;
  };
  
  const nodePositions = getNodePositions();
  
  // Line thickness based on impact
  const getLineThickness = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };
  
  // Line color based on impact
  const getLineColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return '#EA384C';
      case 'medium': return '#F7D154';
      case 'low': return '#77C17E';
      default: return '#ccc';
    }
  };
  
  // Node color based on impact
  const getNodeColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'from-red-100 to-red-50';
      case 'medium': return 'from-amber-100 to-amber-50';
      case 'low': return 'from-green-100 to-green-50';
      default: return 'from-gray-100 to-gray-50';
    }
  };
  
  return (
    <div className="w-full overflow-hidden">
      <svg 
        ref={svgRef} 
        width="100%" 
        height={dimensions.height}
        className="overflow-visible"
      >
        {/* Center point (current issue) */}
        <g>
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={32}
            className="fill-[#9b87f5]/20 stroke-[#9b87f5] stroke-[2]"
          />
          <text
            x={dimensions.width / 2}
            y={dimensions.height / 2 + 5}
            textAnchor="middle"
            fontSize={11}
            fontWeight="500"
            fill="#9b87f5"
          >
            {currentIssue?.name || "Helseproblem"}
          </text>
        </g>
        
        {/* Connection lines */}
        {nodePositions.map(({ system, x, y, impact }) => (
          <line
            key={`line-${system.id}`}
            x1={dimensions.width / 2}
            y1={dimensions.height / 2}
            x2={x}
            y2={y}
            stroke={getLineColor(impact)}
            strokeWidth={getLineThickness(impact)}
            strokeOpacity={hoveredSystem === system.id || hoveredSystem === null ? 1 : 0.3}
            strokeDasharray={impact === 'low' ? "4 2" : "none"}
          />
        ))}
        
        {/* System nodes */}
        {nodePositions.map(({ system, x, y, impact }) => (
          <g
            key={`node-${system.id}`}
            transform={`translate(${x}, ${y})`}
            onMouseEnter={() => setHoveredSystem(system.id)}
            onMouseLeave={() => setHoveredSystem(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              r={28}
              className={`fill-white shadow-sm stroke-gray-200 stroke-1
                ${hoveredSystem === system.id ? 'stroke-[#9b87f5] stroke-2' : ''}`}
            />
            <foreignObject x={-18} y={-18} width={36} height={36}>
              <div className="flex items-center justify-center h-full">
                <SystemIcon name={system.area} size={20} />
              </div>
            </foreignObject>
            
            <text
              y={40}
              textAnchor="middle"
              fontSize={10}
              fontWeight={500}
              fill="#505050"
              className="pointer-events-none"
            >
              {system.area.length > 20 ? `${system.area.substring(0, 18)}...` : system.area}
            </text>
          </g>
        ))}
      </svg>
      
      <div className="flex justify-center items-center gap-6 mt-4">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-[#EA384C]"></span>
          <span className="text-xs text-gray-600">Høy sammenheng</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-[#F7D154]"></span>
          <span className="text-xs text-gray-600">Moderat sammenheng</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-[#77C17E]"></span>
          <span className="text-xs text-gray-600">Svak sammenheng</span>
        </div>
      </div>
    </div>
  );
};

export default SystemRelationshipDiagram;
