import { memo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";
import { motion } from "framer-motion";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// African country ISO codes
const AFRICAN_COUNTRIES = [
    "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CPV", "CMR", "CAF", "TCD", "COM", "COD", "COG", "CIV",
    "DJI", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB", "GMB", "GHA", "GIN", "GNB", "KEN", "LSO", "LBR",
    "LBY", "MDG", "MWI", "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA", "RWA", "STP", "SEN",
    "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA", "TGO", "TUN", "UGA", "ZMB", "ZWE",
];

const NAIROBI: [number, number] = [36.8219, -1.2921];

interface AfricaMapProps {
    className?: string;
}

const AfricaMapComponent = ({ className = "" }: AfricaMapProps) => {
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    return (
        <div className={`relative ${className}`}>
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-[100px] animate-pulse-glow" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative"
            >
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        center: [20, 2],
                        scale: 350,
                    }}
                    width={500}
                    height={550}
                    style={{ width: "100%", height: "auto" }}
                >
                    <defs>
                        {/* Glow filter for Kenya */}
                        <filter id="kenya-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feFlood floodColor="#FF6B00" floodOpacity="0.6" result="color" />
                            <feComposite in="color" in2="blur" operator="in" result="shadow" />
                            <feMerge>
                                <feMergeNode in="shadow" />
                                <feMergeNode in="shadow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Pulse animation for the marker */}
                        <radialGradient id="marker-gradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FF6B00" stopOpacity="1" />
                            <stop offset="60%" stopColor="#FF6B00" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                        </radialGradient>

                        {/* Subtle glow for hovered countries */}
                        <filter id="country-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feFlood floodColor="#FF6B00" floodOpacity="0.3" result="color" />
                            <feComposite in="color" in2="blur" operator="in" result="shadow" />
                            <feMerge>
                                <feMergeNode in="shadow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const countryId = geo.properties?.["ISO_A3"] || geo.id;
                                const isAfrican = AFRICAN_COUNTRIES.includes(countryId);
                                const isKenya = countryId === "KEN";
                                const isHovered = hoveredCountry === countryId;

                                if (!isAfrican) return null;

                                return (
                                    <Geography
                                        key={geo.rpiKey}
                                        geography={geo}
                                        onMouseEnter={() => setHoveredCountry(countryId)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        filter={isKenya ? "url(#kenya-glow)" : isHovered ? "url(#country-glow)" : undefined}
                                        style={{
                                            default: {
                                                fill: isKenya ? "#FF6B00" : "#1a1a2e",
                                                stroke: isKenya ? "#FFD700" : "#FF6B00",
                                                strokeWidth: isKenya ? 1.5 : 0.4,
                                                strokeOpacity: isKenya ? 1 : 0.3,
                                                outline: "none",
                                                transition: "all 0.3s ease",
                                            },
                                            hover: {
                                                fill: isKenya ? "#FF8533" : "#FF6B00",
                                                stroke: "#FFD700",
                                                strokeWidth: 1,
                                                strokeOpacity: 0.8,
                                                outline: "none",
                                                cursor: "pointer",
                                            },
                                            pressed: {
                                                fill: "#FFD700",
                                                outline: "none",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {/* Nairobi Marker with pulsing rings */}
                    <Marker coordinates={NAIROBI}>
                        {/* Outer pulse ring */}
                        <motion.circle
                            r={18}
                            fill="url(#marker-gradient)"
                            opacity={0.3}
                            animate={{ r: [18, 28, 18], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Middle pulse ring */}
                        <motion.circle
                            r={12}
                            fill="none"
                            stroke="#FF6B00"
                            strokeWidth={1.5}
                            opacity={0.5}
                            animate={{ r: [12, 20, 12], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />
                        {/* Center dot */}
                        <circle r={5} fill="#FF6B00" stroke="#FFD700" strokeWidth={2} />
                        {/* Label */}
                        <text
                            textAnchor="middle"
                            y={-16}
                            fill="#FFD700"
                            fontSize={11}
                            fontWeight="bold"
                            fontFamily="Inter, sans-serif"
                            style={{ textShadow: "0 0 10px rgba(255,107,0,0.8)" }}
                        >
                            Nairobi
                        </text>
                    </Marker>
                </ComposableMap>
            </motion.div>

            {/* Tooltip */}
            {hoveredCountry && hoveredCountry !== "KEN" && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium"
                >
                    Coming soon to more African markets
                </motion.div>
            )}
        </div>
    );
};

export const AfricaMap = memo(AfricaMapComponent);
