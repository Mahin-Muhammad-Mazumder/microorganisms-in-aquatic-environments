'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import Chart from 'chart.js/auto';

export interface NodeChartConfig {
  type: 'bar' | 'line' | 'doughnut';
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
  unit: string;
}

export interface SceneNodeData {
  id: string;
  type: 'bacillus' | 'spirillum' | 'diatom' | 'phage' | 'vent' | 'biofilm_mat' | 'water_layer';
  position: [number, number, number];
  color: number;
  label: string;
  subtitle: string;
  bullets: [string, string, string];
  chart: NodeChartConfig;
}

export interface SliderConfig {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  unit: string;
  key: string;
}

export interface SceneDefinition {
  id: number;
  domain: string;
  title: string;
  subtitle: string;
  cameraPos: [number, number, number];
  waterFogColor: number;
  sliderConfig: [SliderConfig, SliderConfig];
  nodes: SceneNodeData[];
}

export const SCENES: SceneDefinition[] = [
  // SCENE 1 (Index 0): The Aquatic Microbiome
  {
    id: 1,
    domain: 'Planetary Biosphere',
    title: 'The Aquatic Microbiome',
    subtitle: 'Microbes constitute 70% of marine biomass, driving planetary carbon and nutrient cycles.',
    cameraPos: [0, 3.2, 13.5],
    waterFogColor: 0x051428,
    sliderConfig: [
      { label: 'Magnification Scale', min: 1, max: 1000, step: 1, defaultVal: 250, unit: 'x', key: 'mag' },
      { label: 'Circulation Flux', min: 0.2, max: 2.5, step: 0.1, defaultVal: 1.0, unit: 'x', key: 'flux' },
    ],
    nodes: [
      {
        id: 's1-prokaryotes',
        type: 'bacillus',
        position: [-4.6, 2.1, 2.2],
        color: 0x38bdf8,
        label: 'Pelagic Bacterioplankton',
        subtitle: '10²⁹ cells globally · Heterotrophic core',
        bullets: [
          'Account for roughly 70% of total marine biological carbon biomass.',
          'Typical seawater holds one million bacterial cells per milliliter.',
          'Drive rapid remineralization of dissolved organic matter across oceans.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Marine Microbial Biomass Share (%)',
          labels: ['Bacteria', 'Protists', 'Archaea', 'Viruses'],
          data: [58, 22, 14, 6],
          colors: ['#38bdf8', '#2dd4bf', '#f59e0b', '#a855f7'],
          unit: '%',
        },
      },
      {
        id: 's1-viruses',
        type: 'phage',
        position: [4.8, 2.4, 1.8],
        color: 0xa855f7,
        label: 'Marine Virosphere Halo',
        subtitle: '10³⁰ virions · Genetic reservoir',
        bullets: [
          'Outnumber aquatic prokaryotic cells by ten-to-one in surface waters.',
          'Turn over 20–40% of standing bacterial biomass every single day.',
          'Mediate horizontal gene transfer via auxiliary metabolic genes (AMGs).',
        ],
        chart: {
          type: 'bar',
          title: 'Log₁₀ Global Abundance in Oceans',
          labels: ['Viruses', 'Bacteria', 'Archaea', 'Protists'],
          data: [30.1, 29.1, 28.4, 26.8],
          colors: ['#a855f7', '#38bdf8', '#f59e0b', '#2dd4bf'],
          unit: 'log₁₀',
        },
      },
      {
        id: 's1-phototrophs',
        type: 'diatom',
        position: [-3.8, -2.5, 3.0],
        color: 0x10b981,
        label: 'Phototrophic Primary Producers',
        subtitle: '50 Pg C/yr fixation · Oxygenic engine',
        bullets: [
          "Generate nearly 50% of Earth's atmospheric oxygen via photosynthesis.",
          'Dominated by cyanobacteria and eukaryotic microalgae in sunlit gyres.',
          'Fuel the biological carbon pump exporting carbon to deep sediments.',
        ],
        chart: {
          type: 'line',
          title: 'Net Primary Production by Latitude (g C/m²/yr)',
          labels: ['60°S', '30°S', 'Equator', '30°N', '60°N'],
          data: [190, 95, 165, 105, 220],
          colors: ['#10b981'],
          unit: 'gC/m²',
        },
      },
      {
        id: 's1-subsurface',
        type: 'vent',
        position: [4.1, -2.6, 2.6],
        color: 0xf59e0b,
        label: 'Deep Subsurface Biosphere',
        subtitle: 'Sub-seafloor sediments · Ultra-slow metabolism',
        bullets: [
          'Harbors ~10²⁹ cells buried kilometers beneath ocean floor sediments.',
          'Microbial turnover times span decades to thousands of years.',
          'Sustained by radiolytic hydrogen, sulfate reduction, and recalcitrant carbon.',
        ],
        chart: {
          type: 'bar',
          title: 'Metabolic Doubling Time (Years)',
          labels: ['Surface', 'Mesopelagic', 'Abyssal Mud', 'Deep Basement'],
          data: [0.01, 0.25, 18, 250],
          colors: ['#38bdf8', '#0284c7', '#f59e0b', '#ef4444'],
          unit: 'yrs',
        },
      },
    ],
  },

  // SCENE 2 (Index 1): Vertical Zonation
  {
    id: 2,
    domain: 'Pelagic Column',
    title: 'Vertical Zonation',
    subtitle: 'Light attenuation and hydrostatic pressure stratify aquatic microbes into distinct vertical communities.',
    cameraPos: [0, 0.5, 14.5],
    waterFogColor: 0x041022,
    sliderConfig: [
      { label: 'Depth Meter', min: 0, max: 4000, step: 25, defaultVal: 200, unit: 'm', key: 'depth' },
      { label: 'Marine Snow Flux', min: 10, max: 250, step: 5, defaultVal: 85, unit: 'mgC/m²/d', key: 'snow' },
    ],
    nodes: [
      {
        id: 's2-neuston',
        type: 'water_layer',
        position: [0, 4.6, 0],
        color: 0x38bdf8,
        label: 'Neuston Surface Microlayer',
        subtitle: '0–1 mm depth · Air-water interface',
        bullets: [
          'Top 1000 micrometers enriched with hydrophobic lipids and polysaccharides.',
          'Bacterioneuston endure intense solar UV radiation and wind shear.',
          'Regulates air-sea gas exchange of methane, CO₂, and dimethylsulfide.',
        ],
        chart: {
          type: 'bar',
          title: 'Enrichment Factor vs Subsurface Water',
          labels: ['Lipids', 'Bacteria', 'Viruses', 'Trace Metals'],
          data: [4.8, 3.2, 3.9, 5.4],
          colors: ['#38bdf8', '#2dd4bf', '#a855f7', '#f59e0b'],
          unit: 'EF',
        },
      },
      {
        id: 's2-euphotic',
        type: 'water_layer',
        position: [0, 1.8, 0],
        color: 0x10b981,
        label: 'Euphotic Zone (0–200m)',
        subtitle: '>1% Surface PAR · Sunlit photic layer',
        bullets: [
          'Supports net photosynthetic carbon fixation by cyanobacteria and diatoms.',
          'Features a Deep Chlorophyll Maximum (DCM) near the nutricline base.',
          'Rapidly grazed by microzooplankton and lysed by lytic cyanophages.',
        ],
        chart: {
          type: 'line',
          title: 'Chlorophyll-a Profile Across Euphotic Depth (µg/L)',
          labels: ['0m', '25m', '50m', '85m (DCM)', '150m', '200m'],
          data: [0.18, 0.24, 0.42, 0.95, 0.28, 0.05],
          colors: ['#10b981'],
          unit: 'µg/L',
        },
      },
      {
        id: 's2-mesopelagic',
        type: 'water_layer',
        position: [0, -1.4, 0],
        color: 0x6366f1,
        label: 'Mesopelagic Twilight (200–1000m)',
        subtitle: 'Dysphotic zone · Remineralization belt',
        bullets: [
          'Over 70% of sinking particulate organic carbon is respired here.',
          'Colonized by particle-attached bacteria secreting ectoenzymes on marine snow.',
          'Rich in chemolithoautotrophic Thaumarchaeota oxidizing ammonia to nitrite.',
        ],
        chart: {
          type: 'line',
          title: 'POC Attenuation via Martin Curve (% Remaining)',
          labels: ['100m', '250m', '500m', '750m', '1000m'],
          data: [100, 46, 24, 17, 13],
          colors: ['#6366f1'],
          unit: '%',
        },
      },
      {
        id: 's2-benthic',
        type: 'biofilm_mat',
        position: [0, -4.6, 0],
        color: 0xf59e0b,
        label: 'Benthic & Abyssal Zone (>1000m)',
        subtitle: '2°C · >10–40 MPa hydrostatic pressure',
        bullets: [
          'Inhabited by piezophilic microbes with polyunsaturated membrane fatty acids.',
          'Fueled by phytodetritus pulses and benthic sediment redox gradients.',
          'Drives long-term carbon burial, denitrification, and methanogenesis.',
        ],
        chart: {
          type: 'bar',
          title: 'Piezophile Growth Rate vs Pressure (MPa)',
          labels: ['0.1 MPa', '10 MPa', '40 MPa', '70 MPa', '100 MPa'],
          data: [0.15, 0.42, 0.88, 0.74, 0.25],
          colors: ['#f59e0b'],
          unit: 'd⁻¹',
        },
      },
    ],
  },

  // SCENE 3 (Index 2): Physicochemical Gradients
  {
    id: 3,
    domain: 'Water Column Physics',
    title: 'Physicochemical Gradients',
    subtitle: 'Sharp vertical clines in temperature, salinity, and oxygen create specialized microbial niches.',
    cameraPos: [0, 0.8, 13.8],
    waterFogColor: 0x061527,
    sliderConfig: [
      { label: 'Solar Irradiance', min: 50, max: 1200, step: 25, defaultVal: 650, unit: 'W/m²', key: 'irradiance' },
      { label: 'Vertical Mixing', min: 0, max: 100, step: 2, defaultVal: 25, unit: '%', key: 'mixing' },
    ],
    nodes: [
      {
        id: 's3-photic',
        type: 'water_layer',
        position: [-3.2, 3.6, 0.8],
        color: 0xfbbf24,
        label: 'Photic Limit & PAR Attenuation',
        subtitle: 'Wavelength filtering · Red absorbed first',
        bullets: [
          'Red light (>600 nm) disappears within the upper 15 meters.',
          'Blue light (450–495 nm) penetrates deepest in oligotrophic gyres.',
          'Selects for phycobilisome pigments tuned to green or blue photons.',
        ],
        chart: {
          type: 'line',
          title: 'Spectral Light Penetration Depth (m)',
          labels: ['Red 660nm', 'Orange 600nm', 'Green 530nm', 'Blue 470nm', 'UV 380nm'],
          data: [15, 35, 110, 240, 65],
          colors: ['#fbbf24'],
          unit: 'm',
        },
      },
      {
        id: 's3-thermocline',
        type: 'water_layer',
        position: [3.2, 1.5, 0.8],
        color: 0xf43f5e,
        label: 'Seasonal Thermocline Barrier',
        subtitle: 'ΔT 10–18°C · Density stratification',
        bullets: [
          'Separates warm, nutrient-depleted surface water from cold deep nutrient pools.',
          'Inhibits vertical turbulent eddy diffusion of nitrate and phosphate.',
          'Arrhenius kinetics reduce microbial enzymatic rates by ~50% per 10°C drop.',
        ],
        chart: {
          type: 'line',
          title: 'Temperature Profile Across Depth (°C)',
          labels: ['0m', '50m', '150m', '300m', '600m', '1200m'],
          data: [24.5, 23.8, 15.2, 9.4, 5.8, 3.2],
          colors: ['#f43f5e'],
          unit: '°C',
        },
      },
      {
        id: 's3-halocline',
        type: 'water_layer',
        position: [-3.2, -0.8, 0.8],
        color: 0x06b6d4,
        label: 'Halocline Density Ledge',
        subtitle: 'Salinity 32–37 PSU · Pycnocline trap',
        bullets: [
          'Steep salinity gradient creates a strong pycnocline density step.',
          'Accumulates sinking marine snow aggregates and chemotactic bacteria.',
          'Requires microbial osmoadaptation via compatible solutes like ectoine.',
        ],
        chart: {
          type: 'line',
          title: 'Salinity & Seawater Density (σₜ kg/m³)',
          labels: ['0m', '25m', '75m', '150m', '300m'],
          data: [23.8, 24.2, 26.1, 26.9, 27.3],
          colors: ['#06b6d4'],
          unit: 'σₜ',
        },
      },
      {
        id: 's3-oxycline',
        type: 'bacillus',
        position: [3.2, -3.2, 0.8],
        color: 0xa855f7,
        label: 'Oxycline & Oxygen Minimum Zone',
        subtitle: 'DO < 20 µmol/kg · Suboxic redox engine',
        bullets: [
          'Intense heterotrophic respiration depletes dissolved oxygen at mid-depths.',
          'Triggers microbial switch to nitrate, nitrite, and sulfate electron acceptors.',
          'Hotspot for anammox (Scalindua) and nitrous oxide (N₂O) emissions.',
        ],
        chart: {
          type: 'line',
          title: 'Dissolved Oxygen Concentration (µmol/kg)',
          labels: ['0m', '100m', '350m (OMZ)', '600m', '1500m'],
          data: [245, 140, 12, 28, 135],
          colors: ['#a855f7'],
          unit: 'µM',
        },
      },
    ],
  },

  // SCENE 4 (Index 3): Freshwater Ecosystems
  {
    id: 4,
    domain: 'Limnology',
    title: 'Freshwater Ecosystems',
    subtitle: 'Hydrodynamic residence time separates fast-flowing lotic river biofilms from stratified lentic lakes.',
    cameraPos: [0, 4.2, 13.5],
    waterFogColor: 0x061a23,
    sliderConfig: [
      { label: 'Flow Velocity', min: 0.1, max: 2.5, step: 0.1, defaultVal: 1.1, unit: 'm/s', key: 'velocity' },
      { label: 'Allochthonous DOC', min: 1, max: 25, step: 1, defaultVal: 8, unit: 'mg/L', key: 'doc' },
    ],
    nodes: [
      {
        id: 's4-lotic',
        type: 'biofilm_mat',
        position: [-4.5, -0.8, 1.5],
        color: 0x10b981,
        label: 'Lotic Epilithic Biofilm',
        subtitle: 'River cobbles · Shear-resistant EPS',
        bullets: [
          'Short water residence time favors benthic biofilms over free bacterioplankton.',
          'Extracellular polymeric substances (EPS) anchor diatoms and bacteria against shear.',
          'Drives longitudinal nutrient spiraling of nitrate and phosphorus downstream.',
        ],
        chart: {
          type: 'line',
          title: 'Biofilm Thickness vs Stream Velocity (µm)',
          labels: ['0.1 m/s', '0.5 m/s', '1.0 m/s', '1.8 m/s', '2.5 m/s'],
          data: [320, 480, 410, 220, 95],
          colors: ['#10b981'],
          unit: 'µm',
        },
      },
      {
        id: 's4-epilimnion',
        type: 'diatom',
        position: [3.8, 2.2, 0.8],
        color: 0x38bdf8,
        label: 'Lentic Epilimnion Layer',
        subtitle: 'Warm surface lake · Oxic photic zone',
        bullets: [
          'Wind-mixed, warm upper lake stratum rich in dissolved oxygen.',
          'Dominated by freshwater Actinobacteria (acI lineage) and Betaproteobacteria.',
          'Experiences seasonal spring diatom and summer cyanobacterial blooms.',
        ],
        chart: {
          type: 'bar',
          title: 'Freshwater Bacterial Phyla Dominance (%)',
          labels: ['Actinobacteria', 'Betaproteo', 'Bacteroidetes', 'Cyanobacteria'],
          data: [42, 28, 16, 14],
          colors: ['#38bdf8', '#2dd4bf', '#f59e0b', '#10b981'],
          unit: '%',
        },
      },
      {
        id: 's4-metalimnion',
        type: 'spirillum',
        position: [3.8, -0.2, 1.2],
        color: 0xfbbf24,
        label: 'Metalimnion Chemocline',
        subtitle: 'Redox transition · Phototrophic sulfur plate',
        bullets: [
          'Sharp thermal and chemical boundary separating oxic and anoxic lake layers.',
          'Hosts dense plates of purple and green phototrophic sulfur bacteria.',
          'Magnetotactic bacteria navigate geomagnetic lines to stay at optimal O₂.',
        ],
        chart: {
          type: 'line',
          title: 'O₂ & H₂S Counter-Gradients at Chemocline (µM)',
          labels: ['4m', '6m', '8m (Plate)', '10m', '12m'],
          data: [260, 110, 15, 0, 0],
          colors: ['#fbbf24'],
          unit: 'µM',
        },
      },
      {
        id: 's4-hypolimnion',
        type: 'vent',
        position: [3.8, -2.8, 0.8],
        color: 0xf97316,
        label: 'Hypolimnion Anoxic Sediment',
        subtitle: '4°C bottom mud · Methanogenic sink',
        bullets: [
          'Isolated dark bottom water becomes anoxic during summer stratification.',
          'Syntrophic bacteria and methanogenic archaea ferment detritus into CH₄.',
          'Methanotrophs at the oxycline oxidize up to 80% of rising methane.',
        ],
        chart: {
          type: 'bar',
          title: 'Terminal Electron Acceptor Energy Yield (kJ/mol)',
          labels: ['O₂ Resp', 'Denitrif', 'Fe(III) Red', 'Sulfate Red', 'Methanogen'],
          data: [500, 475, 220, 150, 130],
          colors: ['#38bdf8', '#2dd4bf', '#f59e0b', '#a855f7', '#f97316'],
          unit: 'kJ',
        },
      },
    ],
  },

  // SCENE 5 (Index 4): Marine & Estuarine Systems
  {
    id: 5,
    domain: 'Estuarine Ecotone',
    title: 'Marine & Estuarine Systems',
    subtitle: 'Estuarine salt wedges trap nutrients and particulates, fueling intense microbial biogeochemical hotspots.',
    cameraPos: [0, 2.2, 13.8],
    waterFogColor: 0x051626,
    sliderConfig: [
      { label: 'Tidal Mixing', min: 0, max: 100, step: 2, defaultVal: 30, unit: '%', key: 'tidal' },
      { label: 'River Discharge', min: 100, max: 5000, step: 100, defaultVal: 1800, unit: 'm³/s', key: 'discharge' },
    ],
    nodes: [
      {
        id: 's5-fresh-plume',
        type: 'bacillus',
        position: [-4.6, 2.0, 1.0],
        color: 0x38bdf8,
        label: 'Buoyant Riverine Plume',
        subtitle: '0–5 PSU · Allochthonous nutrient inflow',
        bullets: [
          'Low-density freshwater flows seaward over denser coastal seawater.',
          'Delivers terrestrial nitrate, silicate, and humic dissolved organic carbon.',
          'Freshwater Betaproteobacteria experience osmotic stress beyond 10 PSU.',
        ],
        chart: {
          type: 'line',
          title: 'Freshwater Taxa Survival Across Salinity (%)',
          labels: ['0 PSU', '5 PSU', '12 PSU', '20 PSU', '35 PSU'],
          data: [100, 82, 34, 11, 2],
          colors: ['#38bdf8'],
          unit: '%',
        },
      },
      {
        id: 's5-pycnocline',
        type: 'water_layer',
        position: [-0.4, 0.3, 1.5],
        color: 0x2dd4bf,
        label: 'Salt-Wedge Halocline Interface',
        subtitle: '5–25 PSU · Osmotic transition zone',
        bullets: [
          'Inclined density boundary where velocity shear mixes fresh and marine water.',
          'Selects for euryhaline bacteria capable of rapid osmolyte synthesis.',
          'Concentrates buoyant phytoplankton and microzooplankton grazers.',
        ],
        chart: {
          type: 'bar',
          title: 'Bacterial Production Rate Across Estuary (µg C/L/h)',
          labels: ['River', 'Upper Wedge', 'ETM Core', 'Lower Bay', 'Coastal Sea'],
          data: [1.8, 3.9, 6.8, 3.2, 1.4],
          colors: ['#38bdf8', '#2dd4bf', '#f59e0b', '#6366f1', '#0284c7'],
          unit: 'µgC/L/h',
        },
      },
      {
        id: 's5-etm',
        type: 'biofilm_mat',
        position: [0.5, -1.8, 1.8],
        color: 0xf59e0b,
        label: 'Estuarine Turbidity Maximum (ETM)',
        subtitle: 'Flocculated aggregates · Enzymatic bioreactor',
        bullets: [
          'Ionic strength causes dissolved colloids and clay to flocculate rapidly.',
          'Particle-attached bacteria represent up to 80% of total activity here.',
          'Intense hotspot for coupled nitrification-denitrification and trace gas flux.',
        ],
        chart: {
          type: 'doughnut',
          title: 'ETM Bacterial Activity Partitioning (%)',
          labels: ['Particle-Attached', 'Free-Living', 'Benthic Resuspended'],
          data: [68, 19, 13],
          colors: ['#f59e0b', '#38bdf8', '#a855f7'],
          unit: '%',
        },
      },
      {
        id: 's5-marine-wedge',
        type: 'spirillum',
        position: [4.6, -1.5, 1.0],
        color: 0x6366f1,
        label: 'Marine Saltwater Wedge',
        subtitle: '30–35 PSU · Coastal Alphaproteobacteria',
        bullets: [
          'Dense seawater intrudes upstream along the bottom channel during flood tides.',
          'Dominated by marine SAR11, Roseobacter clade, and Vibrio species.',
          'High sulfate concentration (28 mM) drives benthic sulfate reduction.',
        ],
        chart: {
          type: 'line',
          title: 'Sulfate vs Methane Production Across Salinity (mM)',
          labels: ['0 PSU', '8 PSU', '16 PSU', '25 PSU', '35 PSU'],
          data: [0.2, 5.5, 13.0, 20.5, 28.2],
          colors: ['#6366f1'],
          unit: 'mM SO₄²⁻',
        },
      },
    ],
  },

  // SCENE 6 (Index 5): Prokaryotes: Bacteria & Cyanobacteria
  {
    id: 6,
    domain: 'Prokaryotic Diversity',
    title: 'Prokaryotes: Bacteria & Cyanobacteria',
    subtitle: 'Streamlined oligotrophs and oxygenic cyanobacteria dominate numerical abundance and primary production across oceans.',
    cameraPos: [0, 2.0, 13.0],
    waterFogColor: 0x041424,
    sliderConfig: [
      { label: 'Nutrient Availability', min: 0.1, max: 50, step: 0.5, defaultVal: 5.0, unit: 'µM N', key: 'nutrient' },
      { label: 'Flagellar Motor RPM', min: 100, max: 1500, step: 50, defaultVal: 600, unit: 'Hz', key: 'rpm' },
    ],
    nodes: [
      {
        id: 's6-sar11',
        type: 'bacillus',
        position: [-4.4, 2.0, 1.2],
        color: 0x38bdf8,
        label: 'Pelagibacter ubique (SAR11)',
        subtitle: 'Alphaproteobacteria · Genome streamlining',
        bullets: [
          'Most abundant organism on Earth, comprising ~25% of all plankton cells.',
          'Ultra-compact 1.3 Mbp genome lacks non-coding DNA and complex regulation.',
          'Uses proteorhodopsin proton pumps to harvest light energy during starvation.',
        ],
        chart: {
          type: 'bar',
          title: 'Genome Size Comparison (Mbp)',
          labels: ['SAR11', 'Prochlorococcus', 'E. coli', 'Vibrio', 'Trichodesmium'],
          data: [1.31, 1.66, 4.64, 5.1, 7.75],
          colors: ['#38bdf8', '#10b981', '#94a3b8', '#f59e0b', '#2dd4bf'],
          unit: 'Mbp',
        },
      },
      {
        id: 's6-prochlorococcus',
        type: 'diatom',
        position: [4.2, 2.1, 1.2],
        color: 0x10b981,
        label: 'Prochlorococcus marinus',
        subtitle: '0.6 µm Picocyanobacterium · Divinyl Chl a/b',
        bullets: [
          'Smallest and most abundant photosynthetic organism on Earth (~3×10²⁷ cells).',
          'High-light and low-light ecotypes partition the upper 200m water column.',
          'High surface-to-volume ratio maximizes nutrient uptake in oligotrophic gyres.',
        ],
        chart: {
          type: 'line',
          title: 'Ecotype Abundance vs Depth (×10⁴ cells/mL)',
          labels: ['10m (HL)', '40m (HL)', '80m', '120m (LL)', '180m (LL)'],
          data: [18, 22, 15, 12, 4],
          colors: ['#10b981'],
          unit: '10⁴/mL',
        },
      },
      {
        id: 's6-trichodesmium',
        type: 'biofilm_mat',
        position: [-4.0, -2.1, 1.6],
        color: 0x2dd4bf,
        label: 'Filamentous Diazotrophs (Trichodesmium)',
        subtitle: 'Colonial trichomes · N₂ fixation',
        bullets: [
          'Fixes inert dinitrogen (N₂) into bioavailable ammonium using nitrogenase.',
          'Gas vesicles provide buoyancy, forming vast golden surface blooms.',
          'Supplies up to 80 Tg of new reactive nitrogen to tropical oceans annually.',
        ],
        chart: {
          type: 'bar',
          title: 'Marine Nitrogen Fixation Inputs (Tg N/yr)',
          labels: ['Trichodesmium', 'UCYN-A / B', 'Diatom-Richelia', 'Heterotrophic N₂'],
          data: [65, 48, 22, 12],
          colors: ['#2dd4bf', '#10b981', '#38bdf8', '#a855f7'],
          unit: 'Tg N/yr',
        },
      },
      {
        id: 's6-vibrio',
        type: 'spirillum',
        position: [4.2, -2.0, 1.6],
        color: 0xf59e0b,
        label: 'Copiotrophic Vibrio & Roseobacter',
        subtitle: 'r-strategists · Chemotactic bursts',
        bullets: [
          'Swim at >60 body lengths per second using sodium-driven polar flagella.',
          'Rapidly colonize chitinous copepod exoskeletons and algal blooms.',
          'Communicate via autoinducer quorum sensing to regulate bioluminescence and biofilm.',
        ],
        chart: {
          type: 'line',
          title: 'Growth Response to Nutrient Pulse (cells/mL ×10⁶)',
          labels: ['0h', '4h', '8h', '12h', '24h', '48h'],
          data: [0.05, 0.4, 2.8, 8.5, 6.2, 1.9],
          colors: ['#f59e0b'],
          unit: '10⁶/mL',
        },
      },
    ],
  },

  // SCENE 7 (Index 6): Eukaryotes & Archaea
  {
    id: 7,
    domain: 'Microeukaryotes & Archaea',
    title: 'Eukaryotes & Archaea',
    subtitle: 'Microbial eukaryotes build mineralized shells and graze plankton while archaea drive ammonia oxidation.',
    cameraPos: [0, 2.2, 13.2],
    waterFogColor: 0x061326,
    sliderConfig: [
      { label: 'Silica Concentration', min: 0.5, max: 80, step: 1, defaultVal: 35, unit: 'µM Si', key: 'silica' },
      { label: 'Microzooplankton Grazing', min: 0.2, max: 4.0, step: 0.1, defaultVal: 1.5, unit: 'd⁻¹', key: 'grazing' },
    ],
    nodes: [
      {
        id: 's7-diatom',
        type: 'diatom',
        position: [-4.4, 2.0, 1.2],
        color: 0x06b6d4,
        label: 'Silica-Armored Diatoms',
        subtitle: 'Bacillariophyta · 20% of global C fixation',
        bullets: [
          'Encased in hydrated silica frustules composed of overlapping epitheca and hypotheca.',
          'Dense silica ballast accelerates sinking, driving 40% of marine carbon export.',
          'Possess a functional urea cycle acquired via endosymbiotic gene transfer.',
        ],
        chart: {
          type: 'bar',
          title: 'Phytoplankton Contribution to Carbon Export (%)',
          labels: ['Diatoms', 'Coccolithophores', 'Dinoflagellates', 'Picophytoplankton'],
          data: [43, 24, 18, 15],
          colors: ['#06b6d4', '#38bdf8', '#f43f5e', '#10b981'],
          unit: '%',
        },
      },
      {
        id: 's7-dinoflagellate',
        type: 'spirillum',
        position: [4.3, 2.0, 1.2],
        color: 0xf43f5e,
        label: 'Mixotrophic Dinoflagellates',
        subtitle: 'Alveolata · Transverse & longitudinal flagella',
        bullets: [
          'Whirling swimming motion driven by a ribbon-like transverse flagellum in the cingulum.',
          'Over 50% combine photosynthesis with phagotrophic ingestion of prey (mixotrophy).',
          'Symbiodiniaceae endosymbionts power reef-building scleractinian coral metabolism.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Dinoflagellate Trophic Strategies (%)',
          labels: ['Mixotrophic', 'Heterotrophic', 'Strict Phototrophic', 'Symbiotic'],
          data: [48, 32, 12, 8],
          colors: ['#f43f5e', '#a855f7', '#10b981', '#f59e0b'],
          unit: '%',
        },
      },
      {
        id: 's7-ciliate',
        type: 'bacillus',
        position: [-4.2, -2.1, 1.5],
        color: 0xa855f7,
        label: 'Ciliates & Heterotrophic Nanoflagellates',
        subtitle: 'Top microbial grazers · Trophic link',
        bullets: [
          'Consume 60–75% of daily primary production and bacterial biomass in oceans.',
          'Regulate bacterial community composition through size-selective phagotrophy.',
          'Regenerate dissolved ammonium and phosphate, sustaining phototrophic growth.',
        ],
        chart: {
          type: 'line',
          title: 'Prey Clearance Rate vs Prey Size (µL/cell/h)',
          labels: ['0.3 µm', '0.8 µm', '1.5 µm', '3.0 µm', '8.0 µm'],
          data: [0.4, 2.8, 5.6, 4.9, 1.2],
          colors: ['#a855f7'],
          unit: 'µL/h',
        },
      },
      {
        id: 's7-archaea',
        type: 'vent',
        position: [4.2, -2.1, 1.5],
        color: 0xf59e0b,
        label: 'Marine Thaumarchaeota (AOA)',
        subtitle: 'Nitrosopumilus · Ether-linked GDGT lipids',
        bullets: [
          'Constitute up to 30–40% of all microbial cells below the euphotic zone.',
          'Possess nanomolar affinity for ammonia, outcompeting bacterial nitrifiers.',
          'Fix inorganic carbon via the ultra-efficient 3-hydroxypropionate/4-hydroxybutyrate cycle.',
        ],
        chart: {
          type: 'line',
          title: 'Archaea Share of Total Prokaryotes by Depth (%)',
          labels: ['0m', '100m', '300m', '1000m', '3000m'],
          data: [2, 8, 26, 38, 42],
          colors: ['#f59e0b'],
          unit: '%',
        },
      },
    ],
  },

  // SCENE 8 (Index 7): Aquatic Viruses & The Viral Shunt
  {
    id: 8,
    domain: 'Marine Virology',
    title: 'Aquatic Viruses & The Viral Shunt',
    subtitle: 'Lytic phages lyse 20–40% of marine bacteria daily, shunting carbon into dissolved pools.',
    cameraPos: [0, 2.0, 13.0],
    waterFogColor: 0x080f24,
    sliderConfig: [
      { label: 'Viral Burst Rate', min: 0, max: 100, step: 2, defaultVal: 35, unit: '% Lysis', key: 'burst' },
      { label: 'Virus-to-Bacterium Ratio', min: 5, max: 50, step: 1, defaultVal: 15, unit: ':1 VBR', key: 'vbr' },
    ],
    nodes: [
      {
        id: 's8-capsid',
        type: 'phage',
        position: [-3.8, 2.4, 1.5],
        color: 0x38bdf8,
        label: 'Icosahedral Cyanophage Capsid',
        subtitle: 'T4-like Myovirus · Auxiliary Metabolic Genes',
        bullets: [
          'Protein capsid protects dsDNA genome against marine nucleases and UV light.',
          'Carries host photosystem II gene (psbA) to maintain ATP synthesis during infection.',
          'Yields 20 to 200 progeny virions per lysed host cell (burst size).',
        ],
        chart: {
          type: 'bar',
          title: 'Burst Size by Host Trophic Group (Virions/Cell)',
          labels: ['SAR11 Phage', 'Cyanophage', 'Roseophage', 'Vibrio Phage', 'Euk Giant Virus'],
          data: [18, 65, 95, 180, 450],
          colors: ['#38bdf8', '#10b981', '#2dd4bf', '#f59e0b', '#a855f7'],
          unit: 'virions',
        },
      },
      {
        id: 's8-tail',
        type: 'phage',
        position: [3.8, 2.2, 1.5],
        color: 0xf59e0b,
        label: 'Contractile Tail & Receptor Fibers',
        subtitle: 'Host specificity · Kill-the-Winner dynamics',
        bullets: [
          'Long tail fibers recognize specific outer-membrane porins and O-antigen sugars.',
          'Density-dependent infection suppresses blooms of single dominant clones.',
          'Maintains high strain-level microbial diversity via Kill-the-Winner dynamics.',
        ],
        chart: {
          type: 'line',
          title: 'Kill-the-Winner Host vs Phage Oscillation',
          labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9', 'Day 12'],
          data: [15, 85, 22, 68, 28, 55],
          colors: ['#f59e0b'],
          unit: '10⁵/mL',
        },
      },
      {
        id: 's8-host-lysis',
        type: 'bacillus',
        position: [0, 0.2, 0],
        color: 0xf43f5e,
        label: 'Lytic Cycle vs Piggyback-the-Winner',
        subtitle: 'Holins & endolysins · Lysogenic switch',
        bullets: [
          'Lytic phages rupture peptidoglycan walls via holin-endolysin pore complexes.',
          'At high microbial densities, temperate phages favor lysogenic prophage integration.',
          'Prophages confer superinfection immunity and horizontal virulence traits.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Daily Bacterial Mortality Partitioning (%)',
          labels: ['Viral Lysis', 'Protist Grazing', 'Starvation / Other'],
          data: [42, 46, 12],
          colors: ['#f43f5e', '#a855f7', '#64748b'],
          unit: '%',
        },
      },
      {
        id: 's8-shunt',
        type: 'water_layer',
        position: [0, -3.2, 1.5],
        color: 0x10b981,
        label: 'The Viral Shunt & Viral Shuttle',
        subtitle: '3 Gt C/yr shunted · DOM & aggregate export',
        bullets: [
          'Diverts cellular carbon away from higher metazoan food webs into dissolved pools.',
          'Liberated cytoplasmic proteins, nucleic acids, and iron stimulate surviving heterotrophs.',
          'Sticky viral lysate also promotes aggregate clumping, aiding deep carbon export.',
        ],
        chart: {
          type: 'bar',
          title: 'Fate of Viral Lysate Carbon (%)',
          labels: ['Respired to CO₂', 'Bacterial Uptake', 'Refractory DOM', 'Sinking Aggregates'],
          data: [48, 32, 12, 8],
          colors: ['#f43f5e', '#10b981', '#38bdf8', '#f59e0b'],
          unit: '%',
        },
      },
    ],
  },

  // === PASTE SCENES 9 TO 15 DATA & GEOMETries HERE ===

  // SCENE 9 (Index 8): The Microbial Loop & Food Webs
  {
    id: 9,
    domain: 'Trophic Energetics',
    title: 'The Microbial Loop & Food Webs',
    subtitle: 'Heterotrophic bacteria rescue dissolved organic carbon, returning energy to classical grazing food chains.',
    cameraPos: [0, 2.2, 13.5],
    waterFogColor: 0x051624,
    sliderConfig: [
      { label: 'Exudate DOC Release', min: 5, max: 60, step: 1, defaultVal: 28, unit: '% NPP', key: 'doc_release' },
      { label: 'Bacterial Growth Efficiency', min: 5, max: 50, step: 1, defaultVal: 22, unit: '% BGE', key: 'bge' },
    ],
    nodes: [
      {
        id: 's9-dom',
        type: 'water_layer',
        position: [-4.2, 2.0, 1.0],
        color: 0x10b981,
        label: 'Phytoplankton DOM Exudation',
        subtitle: 'Labile carbohydrates & amino acids',
        bullets: [
          'Phytoplankton leak 10–50% of fixed carbon as dissolved organic matter (DOM).',
          'Inaccessible to crustacean zooplankton without prokaryotic assimilation.',
          'Labile DOM is consumed within hours by chemotactic bacterioplankton.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Marine Organic Carbon Pool Size (Pg C)',
          labels: ['Refractory DOC', 'Labile DOC', 'Particulate POC', 'Living Biota'],
          data: [642, 25, 30, 3],
          colors: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
          unit: 'Pg C',
        },
      },
      {
        id: 's9-assimilation',
        type: 'bacillus',
        position: [0, 2.4, 1.8],
        color: 0x38bdf8,
        label: 'Heterotrophic Bacterial Repackaging',
        subtitle: 'Dissolved-to-particulate conversion',
        bullets: [
          'Bacteria convert dissolved carbon into particulate cellular biomass.',
          'Bacterial Growth Efficiency (BGE) ranges from 10% in gyres to 40% in blooms.',
          'Remaining carbon is respired back to dissolved inorganic carbon (CO₂).',
        ],
        chart: {
          type: 'bar',
          title: 'Bacterial Growth Efficiency Across Ecosystems (%)',
          labels: ['Open Gyre', 'Coastal Shelf', 'Upwelling', 'Estuary'],
          data: [11, 24, 34, 41],
          colors: ['#38bdf8', '#2dd4bf', '#10b981', '#f59e0b'],
          unit: '%',
        },
      },
      {
        id: 's9-hnf',
        type: 'spirillum',
        position: [4.2, 1.2, 1.0],
        color: 0xa855f7,
        label: 'Nanoflagellate & Ciliate Trophic Link',
        subtitle: 'Bacterivory · Nutrient regeneration',
        bullets: [
          'Heterotrophic nanoflagellates (2–20 µm) graze bacteria and are eaten by ciliates.',
          'Ciliates transfer microbial carbon upward to copepods and larval fish.',
          'Excrete bioavailable ammonium and orthophosphate, closing the nutrient loop.',
        ],
        chart: {
          type: 'line',
          title: 'Energy Remaining Per Trophic Transfer (%)',
          labels: ['DOM Pool', 'Bacteria', 'HNF', 'Ciliates', 'Copepods'],
          data: [100, 28, 8.4, 2.5, 0.75],
          colors: ['#a855f7'],
          unit: '%',
        },
      },
      {
        id: 's9-mcp',
        type: 'biofilm_mat',
        position: [0, -2.5, 1.2],
        color: 0xf59e0b,
        label: 'Microbial Carbon Pump (MCP)',
        subtitle: 'Recalcitrant DOM · Millennial sequestration',
        bullets: [
          'Successive microbial transformation alters labile DOM into refractory RDOM.',
          'RDOM resists biological degradation for 4,000 to 6,000 years in deep oceans.',
          'Stores ~660 Pg of carbon—comparable to all atmospheric CO₂.',
        ],
        chart: {
          type: 'bar',
          title: 'Carbon Residence Time by Pool (Years)',
          labels: ['Labile DOM', 'Semi-Labile', 'Semi-Refractory', 'Refractory RDOM'],
          data: [0.05, 1.5, 20, 5000],
          colors: ['#10b981', '#2dd4bf', '#38bdf8', '#f59e0b'],
          unit: 'yrs',
        },
      },
    ],
  },

  // SCENE 10 (Index 9): Biogeochemical Carbon & Nitrogen Cycles
  {
    id: 10,
    domain: 'Biogeochemistry',
    title: 'Biogeochemical C & N Cycles',
    subtitle: 'Coupled redox transformations of carbon and nitrogen regulate ocean fertility and greenhouse gases.',
    cameraPos: [0, 2.2, 13.5],
    waterFogColor: 0x051525,
    sliderConfig: [
      { label: 'Oxygen Tension', min: 0, max: 250, step: 5, defaultVal: 45, unit: 'µM O₂', key: 'oxygen' },
      { label: 'Iron Dust Deposition', min: 0.1, max: 10, step: 0.2, defaultVal: 2.5, unit: 'mg/m²/yr', key: 'iron' },
    ],
    nodes: [
      {
        id: 's10-diazotrophy',
        type: 'biofilm_mat',
        position: [-4.2, 2.2, 1.2],
        color: 0x10b981,
        label: 'Biological Nitrogen Fixation',
        subtitle: 'N₂ → NH₄⁺ · Iron-molybdenum nitrogenase',
        bullets: [
          'Requires 16 ATP molecules per dinitrogen molecule reduced to ammonia.',
          'Irreversibly inactivated by oxygen; protected via heterocysts or temporal separation.',
          'Heavily co-limited by dissolved iron (Fe) and phosphorus in ocean gyres.',
        ],
        chart: {
          type: 'bar',
          title: 'Cellular Iron Quota by Pathway (Fe:C µmol/mol)',
          labels: ['Heterotrophy', 'Photosynthesis', 'N₂ Fixation'],
          data: [8, 45, 180],
          colors: ['#38bdf8', '#10b981', '#f59e0b'],
          unit: 'µmol/mol',
        },
      },
      {
        id: 's10-nitrification',
        type: 'vent',
        position: [4.2, 2.2, 1.2],
        color: 0x38bdf8,
        label: 'Aerobic Nitrification (AOA & NOB)',
        subtitle: 'NH₄⁺ → NO₂⁻ → NO₃⁻ · Dark ocean autotrophy',
        bullets: [
          'Ammonia-oxidizing archaea (Nitrosopumilus) oxidize NH₄⁺ to nitrite (NO₂⁻).',
          'Nitrite-oxidizing bacteria (Nitrospina) complete oxidation to nitrate (NO₃⁻).',
          'Supplies up to 50% of nitrate fueling new primary production.',
        ],
        chart: {
          type: 'line',
          title: 'Nitrification Rate Across Depth (nmol N/L/d)',
          labels: ['10m', '80m', '150m (Peak)', '400m', '1000m'],
          data: [2, 35, 115, 42, 8],
          colors: ['#38bdf8'],
          unit: 'nmol/L/d',
        },
      },
      {
        id: 's10-denitrification',
        type: 'bacillus',
        position: [-4.0, -2.0, 1.2],
        color: 0xf43f5e,
        label: 'Canonical Denitrification',
        subtitle: 'NO₃⁻ → NO₂⁻ → NO → N₂O → N₂',
        bullets: [
          'Facultative anaerobes respire nitrate when dissolved oxygen drops below 5 µM.',
          'Stepwise reduction mediated by Nar, Nir, Nor, and NosZ metalloenzymes.',
          'Incomplete denitrification releases potent greenhouse gas nitrous oxide (N₂O).',
        ],
        chart: {
          type: 'bar',
          title: 'Fixed Nitrogen Loss Pathways in Oceans (Tg N/yr)',
          labels: ['Sediment Denitrif', 'Water Column Denitrif', 'Anammox'],
          data: [160, 75, 65],
          colors: ['#f43f5e', '#f59e0b', '#a855f7'],
          unit: 'Tg N/yr',
        },
      },
      {
        id: 's10-anammox',
        type: 'spirillum',
        position: [4.0, -2.0, 1.2],
        color: 0xa855f7,
        label: 'Anammox (Planctomycetes)',
        subtitle: 'NH₄⁺ + NO₂⁻ → N₂ + 2H₂O · Anammoxosome',
        bullets: [
          'Anaerobic ammonium oxidation directly couples NH₄⁺ and NO₂⁻ into N₂ gas.',
          'Takes place inside a specialized ladderane-lipid organelle (anammoxosome).',
          'Generates rocket-fuel intermediate hydrazine (N₂H₄) without producing N₂O.',
        ],
        chart: {
          type: 'doughnut',
          title: 'N₂ Loss Split in Oxygen Minimum Zones (%)',
          labels: ['Anammox', 'Heterotrophic Denitrification'],
          data: [44, 56],
          colors: ['#a855f7', '#f43f5e'],
          unit: '%',
        },
      },
    ],
  },

  // SCENE 11 (Index 10): Biofilms & Microbial Mats
  {
    id: 11,
    domain: 'Surface Communities',
    title: 'Biofilms & Microbial Mats',
    subtitle: 'Extracellular polymeric matrices organize millimeter-scale vertical redox towers and quorum signaling.',
    cameraPos: [0, 3.5, 13.0],
    waterFogColor: 0x051822,
    sliderConfig: [
      { label: 'Quorum Sensing AHL', min: 0, max: 100, step: 2, defaultVal: 60, unit: 'nM', key: 'ahl' },
      { label: 'Diel Light Cycle', min: 0, max: 100, step: 2, defaultVal: 80, unit: '% Day', key: 'diel' },
    ],
    nodes: [
      {
        id: 's11-eps',
        type: 'biofilm_mat',
        position: [-4.0, 1.8, 1.2],
        color: 0x10b981,
        label: 'EPS Matrix Architecture',
        subtitle: 'Polysaccharides, eDNA & amyloid fibers',
        bullets: [
          'Hydrated hydrogel matrix accounts for up to 90% of biofilm dry mass.',
          'Extracellular DNA (eDNA) cross-links polysaccharides and accelerates gene transfer.',
          'Interstitial water channels distribute nutrients and flush metabolic waste.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Biofilm Dry Matrix Composition (%)',
          labels: ['Polysaccharides', 'Proteins / Enzymes', 'Microbial Cells', 'eDNA & Lipids'],
          data: [48, 24, 16, 12],
          colors: ['#10b981', '#38bdf8', '#f59e0b', '#a855f7'],
          unit: '%',
        },
      },
      {
        id: 's11-quorum',
        type: 'bacillus',
        position: [4.0, 1.8, 1.2],
        color: 0x38bdf8,
        label: 'Quorum Sensing Signaling',
        subtitle: 'Acyl-homoserine lactones (AHLs) · AI-2',
        bullets: [
          'Chemical autoinducers accumulate until threshold cell density triggers coordinated transcription.',
          'Controls EPS secretion, exozyme production, bioluminescence, and swarming motility.',
          'Competing microbes deploy lactonase enzymes for quorum quenching.',
        ],
        chart: {
          type: 'line',
          title: 'Gene Expression vs Cell Density (Relative Units)',
          labels: ['10⁴/mL', '10⁵/mL', '10⁶/mL (Threshold)', '10⁷/mL', '10⁸/mL'],
          data: [2, 5, 42, 92, 98],
          colors: ['#38bdf8'],
          unit: 'RU',
        },
      },
      {
        id: 's11-winogradsky',
        type: 'water_layer',
        position: [-3.8, -2.0, 1.5],
        color: 0xf59e0b,
        label: 'Stratified Microbial Mat Layers',
        subtitle: 'Millimeter-scale Winogradsky ecosystem',
        bullets: [
          'Top green layer: cyanobacteria generate supersaturated oxygen during daylight.',
          'Middle pink layer: purple sulfur bacteria oxidize H₂S using near-IR light.',
          'Bottom black layer: sulfate-reducing bacteria (Desulfovibrio) precipitate FeS.',
        ],
        chart: {
          type: 'line',
          title: 'Mat Oxygen Microprofile: Noon vs Midnight (µM)',
          labels: ['0 mm', '1 mm', '2 mm', '4 mm', '6 mm'],
          data: [280, 620, 190, 10, 0],
          colors: ['#f59e0b'],
          unit: 'µM O₂',
        },
      },
      {
        id: 's11-plastisphere',
        type: 'diatom',
        position: [3.8, -2.0, 1.5],
        color: 0xf43f5e,
        label: 'The Marine Plastisphere',
        subtitle: 'Microplastic colonization · Pathogen rafts',
        bullets: [
          'Synthetic hydrophobic polymers are colonized within minutes by primary biofilm formers.',
          'Selects for hydrocarbon-degrading bacteria (Alcanivorax, Ideonella) and Vibrio.',
          'Acts as durable buoyant vectors transporting invasive species across ocean basins.',
        ],
        chart: {
          type: 'bar',
          title: 'Taxonomic Enrichment on Microplastics vs Water (Fold)',
          labels: ['Vibrio spp.', 'Hydrocarbonoclastic', 'Benthic Diatoms', 'Fungi'],
          data: [14.5, 9.2, 7.8, 5.4],
          colors: ['#f43f5e', '#f59e0b', '#06b6d4', '#a855f7'],
          unit: '×',
        },
      },
    ],
  },

  // SCENE 12 (Index 11): Extreme Aquatic Environments & Hydrothermal Vents
  {
    id: 12,
    domain: 'Extremophiles',
    title: 'Hydrothermal Vents & Extreme Niches',
    subtitle: 'Chemolithoautotrophs harness geothermal hydrogen sulfide and methane to power dark ecosystems.',
    cameraPos: [0, 2.5, 13.8],
    waterFogColor: 0x080c18,
    sliderConfig: [
      { label: 'Vent Fluid Temp', min: 2, max: 380, step: 5, defaultVal: 260, unit: '°C', key: 'vent_temp' },
      { label: 'H₂S Plume Flux', min: 0.5, max: 20, step: 0.5, defaultVal: 8.5, unit: 'mmol/kg', key: 'h2s' },
    ],
    nodes: [
      {
        id: 's12-chimney',
        type: 'vent',
        position: [0, -0.5, 0],
        color: 0xf97316,
        label: 'Black Smoker Sulfide Chimney',
        subtitle: '350°C fluid · Hyperthermophile limit (122°C)',
        bullets: [
          'Porous polymetallic sulfide walls bridge 350°C anoxic vent fluid and 2°C oxic seawater.',
          'Methanopyrus kandleri grows up to 122°C under high hydrostatic pressure.',
          'Reverse gyrase and ether-linked tetraether lipids prevent thermal denaturation.',
        ],
        chart: {
          type: 'bar',
          title: 'Upper Temperature Limits of Aquatic Life (°C)',
          labels: ['Eukaryotes', 'Phototrophs', 'Bacteria', 'Hyperthermophilic Archaea'],
          data: [62, 73, 95, 122],
          colors: ['#38bdf8', '#10b981', '#f59e0b', '#f97316'],
          unit: '°C',
        },
      },
      {
        id: 's12-chemosynthesis',
        type: 'bacillus',
        position: [-4.4, 1.8, 1.5],
        color: 0x10b981,
        label: 'Chemolithoautotrophic Symbionts',
        subtitle: 'Riftia trophosome · Calvin & rTCA cycles',
        bullets: [
          'Oxidize H₂S, H₂, Fe²⁺, and CH₄ using oxygen or nitrate as electron acceptors.',
          'Endosymbionts inside giant tubeworm (Riftia) trophosomes fix carbon without sunlight.',
          'Operate both the Calvin-Benson cycle and the reductive TCA cycle.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Vent Primary Production Electron Donors (%)',
          labels: ['Hydrogen Sulfide (H₂S)', 'Molecular H₂', 'Methane (CH₄)', 'Ferrous Iron (Fe²⁺)'],
          data: [54, 24, 14, 8],
          colors: ['#10b981', '#38bdf8', '#a855f7', '#f97316'],
          unit: '%',
        },
      },
      {
        id: 's12-cold-seep',
        type: 'biofilm_mat',
        position: [4.4, 1.6, 1.5],
        color: 0xa855f7,
        label: 'Cold Seeps & ANME Consortia',
        subtitle: 'Anaerobic oxidation of methane (AOM)',
        bullets: [
          'Syntrophic consortia of ANME archaea and sulfate-reducing bacteria consume 80% of seabed methane.',
          'Direct interspecies electron transfer (DIET) occurs via conductive multi-heme nanowires.',
          'Precipitates authigenic carbonate reefs across continental margins.',
        ],
        chart: {
          type: 'line',
          title: 'Methane Consumption Across Seep Sediment Depth (mM)',
          labels: ['0 cm', '4 cm (SMTZ)', '8 cm', '12 cm', '20 cm'],
          data: [0.1, 0.8, 4.5, 9.2, 14.0],
          colors: ['#a855f7'],
          unit: 'mM CH₄',
        },
      },
      {
        id: 's12-brine-ice',
        type: 'water_layer',
        position: [0, -3.5, 2.2],
        color: 0x38bdf8,
        label: 'Sea-Ice Brine Channels & Halophiles',
        subtitle: 'Psychrophiles (-20°C) · Hypersaline basins',
        bullets: [
          'Psychrophiles secrete ice-binding antifreeze proteins and exopolysaccharides inside sea-ice veins.',
          'Deep-sea anoxic brine pools (>250 PSU) select for extreme halophilic Archaea (Halobacteria).',
          'Model analogs for astrobiological sub-ice oceans on Europa and Enceladus.',
        ],
        chart: {
          type: 'bar',
          title: 'Membrane Unsaturated Fatty Acid Content (%)',
          labels: ['35°C Mesophile', '15°C Temperate', '4°C Deep Sea', '-10°C Sea Ice'],
          data: [18, 38, 58, 76],
          colors: ['#f97316', '#f59e0b', '#2dd4bf', '#38bdf8'],
          unit: '%',
        },
      },
    ],
  },

  // SCENE 13 (Index 12): Harmful Algal Blooms & Eutrophication
  {
    id: 13,
    domain: 'Anthropogenic Perturbation',
    title: 'Harmful Algal Blooms & Eutrophication',
    subtitle: 'Agricultural nutrient runoff triggers toxic algal blooms and microbial respiration-driven dead zones.',
    cameraPos: [0, 2.4, 13.5],
    waterFogColor: 0x071a18,
    sliderConfig: [
      { label: 'Nitrate & Phosphate Load', min: 1, max: 100, step: 2, defaultVal: 65, unit: 'µM N+P', key: 'eutro' },
      { label: 'Water Temperature Anomaly', min: 0, max: 6, step: 0.2, defaultVal: 2.4, unit: '+°C', key: 'warming' },
    ],
    nodes: [
      {
        id: 's13-cyano-hab',
        type: 'biofilm_mat',
        position: [-4.2, 2.2, 1.2],
        color: 0x10b981,
        label: 'Cyanobacterial Blooms (Microcystis)',
        subtitle: 'Hepatotoxic microcystins · Buoyancy regulation',
        bullets: [
          'Excess phosphorus and warm stratified water favor gas-vacuolated Microcystis and Dolichospermum.',
          'Synthesize cyclic heptapeptide microcystins that inhibit eukaryotic protein phosphatases.',
          'Surface scums shade submerged macrophytes and elevate water pH above 9.5.',
        ],
        chart: {
          type: 'line',
          title: 'Microcystis Dominance vs Total Phosphorus (µg/L)',
          labels: ['5 µg/L', '15 µg/L', '35 µg/L', '75 µg/L', '150 µg/L'],
          data: [4, 18, 52, 81, 94],
          colors: ['#10b981'],
          unit: '%',
        },
      },
      {
        id: 's13-red-tide',
        type: 'spirillum',
        position: [4.2, 2.2, 1.2],
        color: 0xf43f5e,
        label: 'Marine Red Tides (Karenia & Alexandrium)',
        subtitle: 'Saxitoxins & brevetoxins · Neurotoxic shellfish',
        bullets: [
          'Dinoflagellate blooms produce potent voltage-gated sodium channel neurotoxins.',
          'Bioaccumulate in filter-feeding bivalves, causing paralytic and neurotoxic shellfish poisoning.',
          'Aerosolized brevetoxins from lysed cells trigger coastal respiratory irritation.',
        ],
        chart: {
          type: 'bar',
          title: 'Relative Potency of Marine Biotoxins (Mouse LD₅₀ µg/kg)',
          labels: ['Domoic Acid', 'Brevetoxin', 'Okadaic Acid', 'Microcystin-LR', 'Saxitoxin'],
          data: [3600, 500, 192, 50, 9],
          colors: ['#38bdf8', '#f59e0b', '#a855f7', '#10b981', '#f43f5e'],
          unit: 'µg/kg',
        },
      },
      {
        id: 's13-dead-zone',
        type: 'bacillus',
        position: [-3.8, -2.0, 1.4],
        color: 0xa855f7,
        label: 'Senescence & Hypoxic Dead Zones',
        subtitle: 'DO < 2 mg/L · Heterotrophic O₂ drawdown',
        bullets: [
          'When dense algal blooms collapse, sinking biomass fuels explosive bacterial respiration.',
          'Depletes bottom-water dissolved oxygen below 2 mg/L across coastal shelves.',
          'Causes mass mortality of benthic invertebrates and forces demersal fish migration.',
        ],
        chart: {
          type: 'line',
          title: 'Bottom Dissolved Oxygen Following Bloom Collapse (mg/L)',
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 6', 'Week 8'],
          data: [7.8, 5.4, 2.9, 1.1, 0.4, 0.2],
          colors: ['#a855f7'],
          unit: 'mg/L',
        },
      },
      {
        id: 's13-benthic-flux',
        type: 'vent',
        position: [3.8, -2.0, 1.4],
        color: 0xf59e0b,
        label: 'Internal Phosphorus & Sulfide Feedback',
        subtitle: 'Fe(III) reduction · Self-sustaining eutrophication',
        bullets: [
          'Bottom anoxia reduces ferric iron oxyhydroxides (Fe³⁺), releasing bound phosphate (PO₄³⁻).',
          'Sulfate-reducing bacteria generate toxic hydrogen sulfide (H₂S) efflux from sediments.',
          'Creates a positive feedback loop sustaining recurrent summer blooms.',
        ],
        chart: {
          type: 'bar',
          title: 'Sediment PO₄³⁻ Release Rate: Oxic vs Anoxic (mg/m²/d)',
          labels: ['Oxic (>6 mg/L)', 'Suboxic (2 mg/L)', 'Anoxic (0 mg/L)'],
          data: [0.8, 4.5, 22.4],
          colors: ['#38bdf8', '#f59e0b', '#f43f5e'],
          unit: 'mg/m²/d',
        },
      },
    ],
  },

  // SCENE 14 (Index 13): Waterborne Pathogens & Wastewater Treatment
  {
    id: 14,
    domain: 'Public Health & Bioprocess',
    title: 'Pathogens & Wastewater Microbiology',
    subtitle: 'Engineered microbial consortia remove organic load and nutrients while disinfection eliminates enteric pathogens.',
    cameraPos: [0, 2.4, 13.5],
    waterFogColor: 0x051522,
    sliderConfig: [
      { label: 'Aeration & UV Dose', min: 0, max: 100, step: 2, defaultVal: 70, unit: 'mJ/cm²', key: 'uv_dose' },
      { label: 'Influent BOD₅ Load', min: 20, max: 500, step: 10, defaultVal: 220, unit: 'mg/L', key: 'bod' },
    ],
    nodes: [
      {
        id: 's14-pathogens',
        type: 'spirillum',
        position: [-4.3, 2.0, 1.2],
        color: 0xf43f5e,
        label: 'Enteric Bacteria, Viruses & Protozoa',
        subtitle: 'Vibrio cholerae, Norovirus, Cryptosporidium',
        bullets: [
          'Fecal contamination introduces Vibrio cholerae, Salmonella, enteroviruses, and protozoan oocysts.',
          'Cryptosporidium parvum thick-walled oocysts resist standard chlorination.',
          'Monitored via fecal indicator bacteria (E. coli, intestinal enterococci) and qPCR.',
        ],
        chart: {
          type: 'bar',
          title: 'Chlorine Resistance CT₉₉.₉ Value (mg·min/L)',
          labels: ['E. coli', 'Vibrio cholerae', 'Adenovirus', 'Giardia Cysts', 'Cryptosporidium'],
          data: [0.08, 0.12, 0.4, 45, 7200],
          colors: ['#10b981', '#38bdf8', '#a855f7', '#f59e0b', '#f43f5e'],
          unit: 'CT',
        },
      },
      {
        id: 's14-activated-sludge',
        type: 'biofilm_mat',
        position: [0, 2.2, 1.5],
        color: 0x10b981,
        label: 'Activated Sludge Flocs & EBPR',
        subtitle: 'BOD removal · Accumulibacter polyphosphate',
        bullets: [
          'Aerobic bacterial flocs (Zoogloea) oxidize 85–95% of Biochemical Oxygen Demand (BOD).',
          'Ciliates (Vorticella) graze dispersed bacteria, clarifying secondary effluent.',
          'Polyphosphate-accumulating organisms (Accumulibacter) sequester excess phosphorus.',
        ],
        chart: {
          type: 'line',
          title: 'BOD₅ & Ammonia Reduction Across Treatment Stages (%)',
          labels: ['Raw Influent', 'Primary', 'Activated Sludge', 'Tertiary BNR', 'Disinfected'],
          data: [100, 68, 12, 4, 1.5],
          colors: ['#10b981'],
          unit: '% Remaining',
        },
      },
      {
        id: 's14-digestion',
        type: 'vent',
        position: [4.3, 1.8, 1.2],
        color: 0xf59e0b,
        label: 'Anaerobic Sludge Digestion & Biogas',
        subtitle: 'Hydrolysis → Acidogenesis → Methanogenesis',
        bullets: [
          'Four-stage syntrophic consortium converts waste biosolids into renewable biogas (65% CH₄).',
          'Acetoclastic (Methanosaeta) and hydrogenotrophic methanogens require strict anoxia.',
          'Recovers heat and electricity while stabilizing biosolids for agricultural reuse.',
        ],
        chart: {
          type: 'doughnut',
          title: 'Anaerobic Digester Biogas Composition (%)',
          labels: ['Methane (CH₄)', 'Carbon Dioxide (CO₂)', 'N₂ & H₂', 'Trace H₂S / Siloxanes'],
          data: [64, 33, 2, 1],
          colors: ['#f59e0b', '#38bdf8', '#94a3b8', '#f43f5e'],
          unit: '%',
        },
      },
      {
        id: 's14-amr',
        type: 'phage',
        position: [0, -2.3, 1.5],
        color: 0x38bdf8,
        label: 'Wastewater Surveillance & AMR',
        subtitle: 'Metagenomic epidemiology · Plasmid conjugation',
        bullets: [
          'High cell density and sub-inhibitory antibiotics make treatment plants hotspots for plasmid conjugation.',
          'Advanced UV-C (254 nm) and ozonation cross-link thymine dimers and destroy antibiotic resistance genes.',
          'Wastewater-based epidemiology tracks community viral outbreaks days before clinical reporting.',
        ],
        chart: {
          type: 'bar',
          title: 'Log₁₀ Pathogen & ARG Reduction by Tertiary Process',
          labels: ['Sand Filter', 'Chlorination', 'Membrane MBR', 'UV-C + Ozone'],
          data: [1.2, 2.8, 4.5, 5.8],
          colors: ['#94a3b8', '#38bdf8', '#2dd4bf', '#10b981'],
          unit: 'Log₁₀',
        },
      },
    ],
  },

  // SCENE 15 (Index 14): Climate Change, Metagenomics & Future Oceans
  {
    id: 15,
    domain: 'Planetary Futures',
    title: 'Climate Change & Marine Metagenomics',
    subtitle: "Warming, acidification, and multi-omics reveal how aquatic microbes govern Earth's future climate trajectory.",
    cameraPos: [0, 2.5, 13.8],
    waterFogColor: 0x051226,
    sliderConfig: [
      { label: 'Atmospheric pCO₂', min: 280, max: 1000, step: 10, defaultVal: 425, unit: 'ppm', key: 'pco2' },
      { label: 'Metagenomic Sequencing Depth', min: 1, max: 100, step: 1, defaultVal: 50, unit: 'Gbp', key: 'seq' },
    ],
    nodes: [
      {
        id: 's15-acidification',
        type: 'diatom',
        position: [-4.4, 2.0, 1.2],
        color: 0xf43f5e,
        label: 'Ocean Acidification & Calcifiers',
        subtitle: 'pH 8.1 → 7.8 · Carbonate undersaturation',
        bullets: [
          'Oceans absorb ~30% of anthropogenic CO₂, forming carbonic acid and lowering carbonate ions.',
          'Impairs coccolithophore (Emiliania huxleyi) calcite plate precipitation and ballast export.',
          'Alters trace metal speciation (iron bioavailability) and pH-sensitive nitrification rates.',
        ],
        chart: {
          type: 'line',
          title: 'Seawater pH & Aragonite Saturation vs pCO₂',
          labels: ['280 ppm', '420 ppm', '550 ppm', '750 ppm', '1000 ppm'],
          data: [8.18, 8.06, 7.95, 7.82, 7.68],
          colors: ['#f43f5e'],
          unit: 'pH',
        },
      },
      {
        id: 's15-warming-shift',
        type: 'bacillus',
        position: [4.4, 2.0, 1.2],
        color: 0xf59e0b,
        label: 'Metabolic Acceleration & Picophytoplankton Shift',
        subtitle: 'Metabolic Theory of Ecology · Gyre expansion',
        bullets: [
          'Heterotrophic respiration increases faster with warming than photosynthetic carbon fixation.',
          'Stronger thermal stratification expands oligotrophic gyres, favoring <2 µm picophytoplankton.',
          'Reduces average sinking particle size and weakens deep biological carbon sequestration.',
        ],
        chart: {
          type: 'line',
          title: 'Respiration vs Photosynthesis Activation Energy (Normalized)',
          labels: ['10°C', '15°C', '20°C', '25°C', '30°C'],
          data: [1.0, 1.45, 2.15, 3.25, 4.9],
          colors: ['#f59e0b'],
          unit: 'R/P Ratio',
        },
      },
      {
        id: 's15-omics',
        type: 'phage',
        position: [-4.0, -2.1, 1.5],
        color: 0x38bdf8,
        label: 'Shotgun Metagenomics & Tara Oceans',
        subtitle: 'MAGs · Single-cell genomics · eDNA',
        bullets: [
          'Over 99% of aquatic microbes resist laboratory culture (the Great Plate Count Anomaly).',
          'Metagenome-Assembled Genomes (MAGs) reconstruct metabolic pathways directly from filtered seawater.',
          'Metatranscriptomics and metaproteomics quantify real-time in situ gene expression.',
        ],
        chart: {
          type: 'bar',
          title: 'Cataloged Marine Microbial Genes (Millions)',
          labels: ['GOS (2007)', 'Tara Oceans (2015)', 'Tara Virome (2019)', 'Global Ocean Atlas (2025)'],
          data: [6.1, 40.2, 116.8, 315.0],
          colors: ['#94a3b8', '#38bdf8', '#a855f7', '#10b981'],
          unit: 'M Genes',
        },
      },
      {
        id: 's15-biotech',
        type: 'biofilm_mat',
        position: [4.0, -2.1, 1.5],
        color: 0x10b981,
        label: 'Blue Biotechnology & Carbon CDR',
        subtitle: 'PETase enzymes · Algal carbon capture',
        bullets: [
          'Marine metagenomes yield cold-active enzymes, novel polyketide antibiotics, and PET plastic hydrolases.',
          'Microalgal photobioreactors capture flue-gas CO₂ at 10× terrestrial plant efficiency.',
          'Understanding microbial feedbacks is essential for evaluating ocean alkalinity enhancement.',
        ],
        chart: {
          type: 'bar',
          title: 'Areal Carbon Fixation Efficiency (Tons CO₂/ha/yr)',
          labels: ['Temperate Forest', 'Tropical Rainforest', 'Kelp Mariculture', 'Microalgal Bioreactor'],
          data: [12, 28, 65, 185],
          colors: ['#64748b', '#2dd4bf', '#06b6d4', '#10b981'],
          unit: 'tCO₂/ha/yr',
        },
      },
    ],
  },
];

function createProceduralNodeMesh(type: SceneNodeData['type'], colorHex: number): THREE.Group {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(colorHex);
  const accentColor = baseColor.clone().offsetHSL(0.06, 0.1, 0.15);

  const primaryMat = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.25,
    metalness: 0.15,
    emissive: baseColor,
    emissiveIntensity: 0.22,
  });

  const shellMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.36,
    depthWrite: false,
  });

  const detailMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
    metalness: 0.3,
    emissive: baseColor,
    emissiveIntensity: 0.35,
  });

  if (type === 'bacillus') {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 1.35, 24), primaryMat);
    cyl.rotation.z = Math.PI / 2;
    group.add(cyl);

    const capL = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 16), primaryMat);
    capL.position.x = -0.675;
    group.add(capL);

    const capR = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 16), primaryMat);
    capR.position.x = 0.675;
    group.add(capR);

    const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 1.5, 24), shellMat);
    outerCyl.rotation.z = Math.PI / 2;
    group.add(outerCyl);

    const nucleoid = new THREE.Mesh(new THREE.TorusKnotGeometry(0.22, 0.045, 48, 8, 2, 3), detailMat);
    nucleoid.scale.set(1.8, 0.8, 0.8);
    group.add(nucleoid);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pilus = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6), detailMat);
      pilus.position.set(((i % 3) - 1) * 0.4, Math.cos(angle) * 0.62, Math.sin(angle) * 0.62);
      pilus.rotation.x = angle;
      group.add(pilus);
    }
  } else if (type === 'spirillum') {
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI * 1.65 - Math.PI * 0.82;
      curvePoints.push(new THREE.Vector3(t * 0.62, Math.sin(t * 2.0) * 0.32, Math.cos(t * 2.0) * 0.22));
    }
    const bodyCurve = new THREE.CatmullRomCurve3(curvePoints);
    const bodyMesh = new THREE.Mesh(new THREE.TubeGeometry(bodyCurve, 36, 0.32, 16, false), primaryMat);
    group.add(bodyMesh);

    const startCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), primaryMat);
    startCap.position.copy(curvePoints[0]);
    group.add(startCap);

    const endCap = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), primaryMat);
    endCap.position.copy(curvePoints[curvePoints.length - 1]);
    group.add(endCap);

    const flagPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 30; i++) {
      const s = i / 30;
      flagPoints.push(
        new THREE.Vector3(
          curvePoints[curvePoints.length - 1].x + s * 1.45,
          Math.sin(s * Math.PI * 5) * 0.18,
          Math.cos(s * Math.PI * 5) * 0.18
        )
      );
    }
    const flagCurve = new THREE.CatmullRomCurve3(flagPoints);
    const flagMesh = new THREE.Mesh(new THREE.TubeGeometry(flagCurve, 32, 0.03, 8, false), detailMat);
    flagMesh.name = 'animated_flagellum';
    group.add(flagMesh);
  } else if (type === 'diatom') {
    const epitheca = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.28, 32), primaryMat);
    epitheca.position.y = 0.12;
    group.add(epitheca);

    const hypotheca = new THREE.Mesh(new THREE.CylinderGeometry(0.89, 0.89, 0.28, 32), shellMat);
    hypotheca.position.y = -0.12;
    group.add(hypotheca);

    const girdle = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 16, 48), detailMat);
    girdle.rotation.x = Math.PI / 2;
    group.add(girdle);

    for (let i = 0; i < 12; i++) {
      const ribAngle = (i / 12) * Math.PI * 2;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.05, 0.045), detailMat);
      rib.position.y = 0.27;
      rib.rotation.y = ribAngle;
      group.add(rib);
    }

    const nodule = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), detailMat);
    nodule.position.y = 0.26;
    group.add(nodule);
  } else if (type === 'phage') {
    const capsid = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0), primaryMat);
    capsid.position.y = 0.68;
    group.add(capsid);

    const cage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.65, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.45 })
    );
    cage.position.y = 0.68;
    group.add(cage);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16), detailMat);
    collar.position.y = 0.08;
    group.add(collar);

    const sheath = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.78, 16), primaryMat);
    sheath.position.y = -0.32;
    group.add(sheath);

    const baseplate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.1, 6), detailMat);
    baseplate.position.y = -0.72;
    group.add(baseplate);

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.018, 0.72, 8), detailMat);
      leg.position.set(Math.cos(a) * 0.42, -0.96, Math.sin(a) * 0.42);
      leg.rotation.z = -Math.cos(a) * 0.55;
      leg.rotation.x = Math.sin(a) * 0.55;
      group.add(leg);
    }
  } else if (type === 'vent') {
    const mainSpire = new THREE.Mesh(new THREE.ConeGeometry(0.78, 1.85, 9, 4, true), primaryMat);
    group.add(mainSpire);

    const sideSpire = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.15, 8), primaryMat);
    sideSpire.position.set(0.52, -0.32, 0.25);
    group.add(sideSpire);

    const orifice = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.08, 12, 24), detailMat);
    orifice.position.y = 0.85;
    orifice.rotation.x = Math.PI / 2;
    group.add(orifice);

    for (let i = 0; i < 3; i++) {
      const plumeRing = new THREE.Mesh(new THREE.TorusGeometry(0.32 + i * 0.16, 0.035, 10, 24), shellMat);
      plumeRing.position.y = 1.05 + i * 0.28;
      plumeRing.rotation.x = Math.PI / 2;
      group.add(plumeRing);
    }
  } else if (type === 'biofilm_mat') {
    const baseSlab = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.12, 0.26, 28), primaryMat);
    baseSlab.position.y = -0.22;
    group.add(baseSlab);

    const epsDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      shellMat
    );
    epsDome.position.y = -0.1;
    group.add(epsDome);

    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const r = 0.35 + (i % 2) * 0.28;
      const cell = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), detailMat);
      cell.position.set(Math.cos(angle) * r, 0.08 + (i % 3) * 0.1, Math.sin(angle) * r);
      cell.scale.set(1.4, 0.9, 0.9);
      cell.rotation.y = angle;
      group.add(cell);
    }
  } else {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.065, 16, 48), primaryMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.06, 36), shellMat);
    group.add(disc);

    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const buoy = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), detailMat);
      buoy.position.set(Math.cos(a) * 1.18, 0, Math.sin(a) * 1.18);
      group.add(buoy);
    }
  }

  const haloMat = new THREE.MeshBasicMaterial({
    color: baseColor,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });
  const halo = new THREE.Mesh(new THREE.RingGeometry(1.22, 1.32, 36), haloMat);
  halo.name = 'selection_halo';
  group.add(halo);

  const hitProxy = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 12, 12),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  group.add(hitProxy);

  return group;
}

export default function AquaticSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelsContainerRef = useRef<HTMLDivElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number | null>(null);
  const [slider1Val, setSlider1Val] = useState<number>(SCENES[0].sliderConfig[0].defaultVal);
  const [slider2Val, setSlider2Val] = useState<number>(SCENES[0].sliderConfig[1].defaultVal);
  const [isDockHidden, setIsDockHidden] = useState(false);

  // Mutable refs for Three.js loop
  const engineRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    activeSceneGroup: THREE.Group;
    clickableMeshes: THREE.Group[];
    labelEls: HTMLButtonElement[];
    keyLight: THREE.DirectionalLight;
    pointLight: THREE.PointLight;
    envState: Record<string, any>;
    currentSceneIdx: number;
    selectedIdx: number | null;
    sliders: [number, number];
  } | null>(null);

  const currentScene = SCENES[sceneIndex];
  const activeNode = selectedNodeIdx !== null ? currentScene.nodes[selectedNodeIdx] : null;

  // Update Chart.js inside Right Inspector Drawer
  useEffect(() => {
    if (!activeNode || !chartCanvasRef.current) return;

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const s1Cfg = currentScene.sliderConfig[0];
    const normSlider = (slider1Val - s1Cfg.min) / Math.max(0.0001, s1Cfg.max - s1Cfg.min);
    const scaleFactor = 0.85 + normSlider * 0.3;

    const chartCfg = activeNode.chart;
    const dynamicData = chartCfg.data.map((val, idx) => {
      if (chartCfg.type === 'doughnut') return val;
      const mod = idx % 2 === 0 ? scaleFactor : 1.0 + (1.0 - scaleFactor) * 0.5;
      return Number((val * mod).toFixed(2));
    });

    const isDoughnut = chartCfg.type === 'doughnut';
    chartInstanceRef.current = new Chart(ctx, {
      type: chartCfg.type,
      data: {
        labels: chartCfg.labels,
        datasets: [
          {
            label: chartCfg.unit,
            data: dynamicData,
            backgroundColor: isDoughnut
              ? chartCfg.colors
              : chartCfg.colors.length > 1
              ? chartCfg.colors
              : 'rgba(56, 189, 248, 0.32)',
            borderColor: chartCfg.colors[0] || '#38bdf8',
            borderWidth: 1.8,
            tension: 0.35,
            fill: chartCfg.type === 'line',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        plugins: {
          legend: {
            display: isDoughnut,
            position: 'right',
            labels: { color: '#cbd5e1', font: { size: 10 }, boxWidth: 10 },
          },
        },
        scales: isDoughnut
          ? {}
          : {
              x: {
                ticks: { color: '#94a3b8', font: { size: 10 } },
                grid: { color: 'rgba(148, 163, 184, 0.08)' },
              },
              y: {
                ticks: { color: '#94a3b8', font: { size: 10 } },
                grid: { color: 'rgba(148, 163, 184, 0.12)' },
              },
            },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [activeNode, slider1Val, currentScene]);

  const applySliderEffects = useCallback((scIdx: number, s1: number, s2: number) => {
    const eng = engineRef.current;
    if (!eng) return;
    eng.sliders = [s1, s2];

    const s1Cfg = SCENES[scIdx].sliderConfig[0];
    const norm1 = (s1 - s1Cfg.min) / Math.max(0.0001, s1Cfg.max - s1Cfg.min);

    if (scIdx === 0) {
      const nodeScale = 0.75 + norm1 * 0.75;
      eng.clickableMeshes.forEach((m) => m.scale.setScalar(nodeScale));
    } else if (scIdx === 1 && eng.envState.probeDisc) {
      const probeY = 4.6 - norm1 * 9.2;
      eng.envState.probeDisc.position.y = probeY;
      eng.pointLight.intensity = 1.4 - norm1 * 0.95;
    } else if (scIdx === 2) {
      eng.keyLight.intensity = 0.6 + norm1 * 1.6;
      if (eng.envState.gradPoints) {
        const colors = eng.envState.gradPoints.geometry.attributes.color.array as Float32Array;
        const pos = eng.envState.gradPoints.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length / 3; i++) {
          const y = pos[i * 3 + 1];
          const normY = (y + 5.0) / 10.0;
          const c = new THREE.Color().setHSL(
            Math.max(0.02, 0.66 - normY * (0.45 + norm1 * 0.22)),
            0.9,
            0.45 + norm1 * 0.2
          );
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }
        eng.envState.gradPoints.geometry.attributes.color.needsUpdate = true;
      }
    } else if (scIdx === 4 && eng.envState.haloclinePlane) {
      eng.envState.haloclinePlane.rotation.y = -0.28 * (1.0 - norm1 * 0.75);
    } else if (scIdx === 5 && eng.clickableMeshes.length >= 4) {
      eng.clickableMeshes[0].scale.setScalar(1.25 - norm1 * 0.45);
      eng.clickableMeshes[1].scale.setScalar(1.2 - norm1 * 0.35);
      eng.clickableMeshes[2].scale.setScalar(0.8 + norm1 * 0.55);
      eng.clickableMeshes[3].scale.setScalar(0.75 + norm1 * 0.65);
    } else if (scIdx === 6 && eng.clickableMeshes.length >= 1) {
      eng.clickableMeshes[0].scale.setScalar(0.8 + norm1 * 0.6);
    } else if (scIdx === 7 && eng.envState.burstPoints && eng.envState.burstDirs) {
      const pos = eng.envState.burstPoints.geometry.attributes.position.array as Float32Array;
      const dirs = eng.envState.burstDirs as THREE.Vector3[];
      const burstRadius = 0.75 + norm1 * 5.2;
      for (let i = 0; i < dirs.length; i++) {
        const d = dirs[i];
        const jitter = 0.65 + (i % 7) * 0.12;
        pos[i * 3] = d.x * burstRadius * jitter;
        pos[i * 3 + 1] = d.y * burstRadius * jitter;
        pos[i * 3 + 2] = d.z * burstRadius * jitter;
      }
      eng.envState.burstPoints.geometry.attributes.position.needsUpdate = true;
      if (eng.envState.hostShell) {
        eng.envState.hostShell.scale.setScalar(1.0 + norm1 * 0.45);
        eng.envState.hostShell.material.opacity = Math.max(0.06, 0.36 - norm1 * 0.28);
      }
    }
  }, []);

  const focusNode = useCallback((nodeIdx: number) => {
    const eng = engineRef.current;
    if (!eng) return;
    const scData = SCENES[eng.currentSceneIdx];
    if (!scData || nodeIdx < 0 || nodeIdx >= scData.nodes.length) return;

    eng.selectedIdx = nodeIdx;
    setSelectedNodeIdx(nodeIdx);

    eng.labelEls.forEach((el, i) => {
      if (i === nodeIdx) {
        el.style.borderColor = '#38bdf8';
        el.style.backgroundColor = 'rgba(12, 36, 68, 0.98)';
      } else {
        el.style.borderColor = 'rgba(51, 65, 85, 0.9)';
        el.style.backgroundColor = 'rgba(7, 19, 36, 0.9)';
      }
    });

    const targetMesh = eng.clickableMeshes[nodeIdx];
    if (!targetMesh) return;
    const pos = targetMesh.position;
    const camOffset = new THREE.Vector3(pos.x * 0.35 + 1.2, pos.y + 0.85, pos.z + 4.6);

    gsap.to(eng.camera.position, {
      x: camOffset.x,
      y: camOffset.y,
      z: camOffset.z,
      duration: 1.0,
      ease: 'power3.out',
    });

    gsap.to(eng.controls.target, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration: 1.0,
      ease: 'power3.out',
    });
  }, []);

  const resetCamera = useCallback(() => {
    const eng = engineRef.current;
    if (!eng) return;
    const scData = SCENES[eng.currentSceneIdx];
    eng.selectedIdx = null;
    setSelectedNodeIdx(null);

    eng.labelEls.forEach((el) => {
      el.style.borderColor = 'rgba(51, 65, 85, 0.9)';
      el.style.backgroundColor = 'rgba(7, 19, 36, 0.9)';
    });

    gsap.to(eng.camera.position, {
      x: scData.cameraPos[0],
      y: scData.cameraPos[1],
      z: scData.cameraPos[2],
      duration: 1.0,
      ease: 'power3.out',
    });

    gsap.to(eng.controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.0,
      ease: 'power3.out',
    });
  }, []);

  const switchScene = useCallback(
    (newIdx: number) => {
      const wrapped = (newIdx + SCENES.length) % SCENES.length;
      const scData = SCENES[wrapped];
      setSceneIndex(wrapped);
      setSelectedNodeIdx(null);
      setSlider1Val(scData.sliderConfig[0].defaultVal);
      setSlider2Val(scData.sliderConfig[1].defaultVal);

      const eng = engineRef.current;
      if (!eng || !labelsContainerRef.current) return;

      eng.currentSceneIdx = wrapped;
      eng.selectedIdx = null;

      // Dispose previous meshes
      while (eng.activeSceneGroup.children.length > 0) {
        const child = eng.activeSceneGroup.children[0];
        eng.activeSceneGroup.remove(child);
      }
      eng.clickableMeshes = [];
      labelsContainerRef.current.innerHTML = '';
      eng.labelEls = [];

      if (eng.scene.fog instanceof THREE.FogExp2) {
        eng.scene.fog.color.setHex(scData.waterFogColor);
      }

      // Build scene environment
      const envSub = new THREE.Group();
      eng.activeSceneGroup.add(envSub);
      eng.envState = {};

      if (wrapped === 0) {
        const oceanGlobe = new THREE.Mesh(
          new THREE.SphereGeometry(2.65, 40, 40),
          new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.2,
            metalness: 0.1,
            transparent: true,
            opacity: 0.42,
          })
        );
        envSub.add(oceanGlobe);

        const wireGlobe = new THREE.Mesh(
          new THREE.SphereGeometry(2.68, 24, 18),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.18 })
        );
        envSub.add(wireGlobe);

        const ring1 = new THREE.Mesh(
          new THREE.TorusGeometry(4.2, 0.03, 12, 80),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
        );
        ring1.rotation.x = Math.PI * 0.35;
        ring1.rotation.y = Math.PI * 0.15;
        envSub.add(ring1);

        const ring2 = new THREE.Mesh(
          new THREE.TorusGeometry(4.8, 0.025, 12, 80),
          new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.28 })
        );
        ring2.rotation.x = -Math.PI * 0.4;
        ring2.rotation.z = Math.PI * 0.2;
        envSub.add(ring2);

        eng.envState = { globe: oceanGlobe, wireGlobe, ring1, ring2 };
      } else if (wrapped === 1) {
        const columnMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(3.2, 3.2, 11.2, 36, 1, true),
          new THREE.MeshStandardMaterial({
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        envSub.add(columnMesh);

        const probeDisc = new THREE.Mesh(
          new THREE.TorusGeometry(3.35, 0.06, 16, 64),
          new THREE.MeshBasicMaterial({ color: 0x7dd3fc })
        );
        probeDisc.rotation.x = Math.PI / 2;
        probeDisc.position.y = 3.5;
        envSub.add(probeDisc);

        const snowCount = 280;
        const snowGeo = new THREE.BufferGeometry();
        const snowPos = new Float32Array(snowCount * 3);
        for (let i = 0; i < snowCount; i++) {
          const r = Math.random() * 2.9;
          const a = Math.random() * Math.PI * 2;
          snowPos[i * 3] = Math.cos(a) * r;
          snowPos[i * 3 + 1] = (Math.random() - 0.5) * 11.0;
          snowPos[i * 3 + 2] = Math.sin(a) * r;
        }
        snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
        const snowPoints = new THREE.Points(
          snowGeo,
          new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.08, transparent: true, opacity: 0.75 })
        );
        envSub.add(snowPoints);
        eng.envState = { probeDisc, snowPoints };
      } else if (wrapped === 2) {
        const pCount = 700;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pCol = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
          const y = (Math.random() - 0.5) * 10.0;
          pPos[i * 3] = (Math.random() - 0.5) * 7.5;
          pPos[i * 3 + 1] = y;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
          const normY = (y + 5.0) / 10.0;
          const c = new THREE.Color().setHSL(0.68 - normY * 0.58, 0.9, 0.55);
          pCol[i * 3] = c.r;
          pCol[i * 3 + 1] = c.g;
          pCol[i * 3 + 2] = c.b;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
        const gradPoints = new THREE.Points(
          pGeo,
          new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.85 })
        );
        envSub.add(gradPoints);
        eng.envState = { gradPoints };
      } else if (wrapped === 3) {
        const divider = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 6.5, 5.5),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
        );
        divider.position.set(-0.5, -0.8, 0);
        envSub.add(divider);

        const streamCount = 320;
        const streamGeo = new THREE.BufferGeometry();
        const streamPos = new Float32Array(streamCount * 3);
        for (let i = 0; i < streamCount; i++) {
          streamPos[i * 3] = -7.0 + Math.random() * 6.2;
          streamPos[i * 3 + 1] = -1.5 + Math.random() * 3.2;
          streamPos[i * 3 + 2] = (Math.random() - 0.5) * 4.2;
        }
        streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
        const streamPoints = new THREE.Points(
          streamGeo,
          new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.12, transparent: true, opacity: 0.85 })
        );
        envSub.add(streamPoints);
        eng.envState = { streamPoints };

        const layerColors = [0x38bdf8, 0xfbbf24, 0xf97316];
        const layerY = [2.0, -0.2, -2.5];
        layerColors.forEach((col, idx) => {
          const plane = new THREE.Mesh(
            new THREE.BoxGeometry(6.2, 1.5, 4.4),
            new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.14, depthWrite: false })
          );
          plane.position.set(3.2, layerY[idx], 0);
          envSub.add(plane);
        });
      } else if (wrapped === 4) {
        const wedgeCount = 600;
        const wedgeGeo = new THREE.BufferGeometry();
        const wedgePos = new Float32Array(wedgeCount * 3);
        const wedgeCol = new Float32Array(wedgeCount * 3);
        for (let i = 0; i < wedgeCount; i++) {
          const isFresh = i < wedgeCount / 2;
          wedgePos[i * 3] = (Math.random() - 0.5) * 12.0;
          wedgePos[i * 3 + 1] = isFresh ? 0.5 + Math.random() * 2.5 : -2.8 + Math.random() * 2.5;
          wedgePos[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
          const c = new THREE.Color(isFresh ? 0x38bdf8 : 0x6366f1);
          wedgeCol[i * 3] = c.r;
          wedgeCol[i * 3 + 1] = c.g;
          wedgeCol[i * 3 + 2] = c.b;
        }
        wedgeGeo.setAttribute('position', new THREE.BufferAttribute(wedgePos, 3));
        wedgeGeo.setAttribute('color', new THREE.BufferAttribute(wedgeCol, 3));
        const wedgePoints = new THREE.Points(
          wedgeGeo,
          new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.85 })
        );
        envSub.add(wedgePoints);

        const haloclinePlane = new THREE.Mesh(
          new THREE.PlaneGeometry(12.5, 4.8),
          new THREE.MeshStandardMaterial({
            color: 0x2dd4bf,
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        haloclinePlane.rotation.x = Math.PI / 2;
        haloclinePlane.rotation.y = -0.24;
        envSub.add(haloclinePlane);
        eng.envState = { wedgePoints, haloclinePlane };
      } else if (wrapped === 7) {
        const hostShell = new THREE.Mesh(
          new THREE.SphereGeometry(2.15, 32, 32),
          new THREE.MeshStandardMaterial({
            color: 0x10b981,
            roughness: 0.3,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
          })
        );
        envSub.add(hostShell);

        const burstCount = 450;
        const burstGeo = new THREE.BufferGeometry();
        const burstPos = new Float32Array(burstCount * 3);
        const burstDirs: THREE.Vector3[] = [];
        const burstCol = new Float32Array(burstCount * 3);
        for (let i = 0; i < burstCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const dir = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
          );
          burstDirs.push(dir);
          burstPos[i * 3] = dir.x * 0.8;
          burstPos[i * 3 + 1] = dir.y * 0.8;
          burstPos[i * 3 + 2] = dir.z * 0.8;
          const c = new THREE.Color(i % 2 === 0 ? 0x38bdf8 : 0xf43f5e);
          burstCol[i * 3] = c.r;
          burstCol[i * 3 + 1] = c.g;
          burstCol[i * 3 + 2] = c.b;
        }
        burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
        burstGeo.setAttribute('color', new THREE.BufferAttribute(burstCol, 3));
        const burstPoints = new THREE.Points(
          burstGeo,
          new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.9 })
        );
        envSub.add(burstPoints);
        eng.envState = { hostShell, burstPoints, burstDirs };
      } else {
        const stageGrid = new THREE.PolarGridHelper(6.5, 16, 6, 64, 0x1e293b, 0x0f172a);
        stageGrid.position.y = -3.8;
        envSub.add(stageGrid);

        const fluxRing = new THREE.Mesh(
          new THREE.TorusGeometry(4.6, 0.025, 12, 96),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 })
        );
        fluxRing.rotation.x = Math.PI / 2;
        envSub.add(fluxRing);
        eng.envState = { fluxRing };
      }

      // Spawn clickable 3D nodes & floating HTML badges
      scData.nodes.forEach((nodeData, idx) => {
        const meshGroup = createProceduralNodeMesh(nodeData.type, nodeData.color);
        meshGroup.position.set(nodeData.position[0], nodeData.position[1], nodeData.position[2]);
        meshGroup.userData = {
          nodeIndex: idx,
          nodeData,
          basePosition: new THREE.Vector3(...nodeData.position),
        };
        eng.activeSceneGroup.add(meshGroup);
        eng.clickableMeshes.push(meshGroup);

        const badge = document.createElement('button');
        badge.type = 'button';
        badge.style.position = 'absolute';
        badge.style.transform = 'translate(-50%, -100%)';
        badge.style.pointerEvents = 'auto';
        badge.className =
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071324]/90 border border-slate-700/90 hover:border-sky-400 text-xs text-slate-100 shadow-lg whitespace-nowrap transition-colors cursor-pointer';
        badge.innerHTML = `<span class="font-mono text-[11px] font-semibold text-sky-400">[${idx + 1}]</span><span class="font-medium">${nodeData.label}</span>`;
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          focusNode(idx);
        });
        labelsContainerRef.current?.appendChild(badge);
        eng.labelEls.push(badge);
      });

      gsap.to(eng.camera.position, {
        x: scData.cameraPos[0],
        y: scData.cameraPos[1],
        z: scData.cameraPos[2],
        duration: 1.15,
        ease: 'power3.out',
      });
      gsap.to(eng.controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.15,
        ease: 'power3.out',
      });

      applySliderEffects(wrapped, scData.sliderConfig[0].defaultVal, scData.sliderConfig[1].defaultVal);
    },
    [applySliderEffects, focusNode]
  );

  // Initialize Three.js WebGL Engine once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const gpu = ext ? String(probe.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040b16);
    scene.fog = new THREE.FogExp2(0x051428, 0.028);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 3.2, 13.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.0;
    controls.maxDistance = 32.0;

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x06152d, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.35);
    keyLight.position.set(8, 16, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.75);
    rimLight.position.set(-10, -8, -8);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.1, 30);
    pointLight.position.set(0, 4, 6);
    scene.add(pointLight);

    const activeSceneGroup = new THREE.Group();
    scene.add(activeSceneGroup);

    // Ambient marine particle field
    const ambientCount = isSoftwareGl ? 320 : 650;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPos = new Float32Array(ambientCount * 3);
    const ambientCol = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      ambientPos[i * 3] = (Math.random() - 0.5) * 34;
      ambientPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
      const c = new THREE.Color().setHSL(0.52 + Math.random() * 0.1, 0.8, 0.55 + Math.random() * 0.25);
      ambientCol[i * 3] = c.r;
      ambientCol[i * 3 + 1] = c.g;
      ambientCol[i * 3 + 2] = c.b;
    }
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
    ambientGeo.setAttribute('color', new THREE.BufferAttribute(ambientCol, 3));
    const ambientParticles = new THREE.Points(
      ambientGeo,
      new THREE.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false })
    );
    scene.add(ambientParticles);

    engineRef.current = {
      scene,
      camera,
      renderer,
      controls,
      activeSceneGroup,
      clickableMeshes: [],
      labelEls: [],
      keyLight,
      pointLight,
      envState: {},
      currentSceneIdx: 0,
      selectedIdx: null,
      sliders: [SCENES[0].sliderConfig[0].defaultVal, SCENES[0].sliderConfig[1].defaultVal],
    };

    // Initial scene load
    switchScene(0);

    // Raycasting on click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
      const eng = engineRef.current;
      if (!eng) return;

      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, eng.camera);
      const intersects = raycaster.intersectObjects(eng.clickableMeshes, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.userData.nodeIndex === undefined) {
          obj = obj.parent;
        }
        if (obj && obj.userData.nodeIndex !== undefined) {
          focusNode(obj.userData.nodeIndex);
        }
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    const projVec = new THREE.Vector3();
    let frameId = 0;

    const animate = () => {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const eng = engineRef.current;

      if (eng) {
        eng.controls.update();
        ambientParticles.rotation.y = elapsed * 0.02;

        eng.clickableMeshes.forEach((mesh, idx) => {
          const basePos = mesh.userData.basePosition as THREE.Vector3;
          mesh.position.y = basePos.y + Math.sin(elapsed * 1.6 + idx * 1.4) * 0.14;
          mesh.rotation.y = elapsed * 0.35 + idx * 0.5;

          const halo = mesh.getObjectByName('selection_halo') as THREE.Mesh | undefined;
          if (halo) {
            halo.lookAt(eng.camera.position);
            const isSel = idx === eng.selectedIdx;
            halo.scale.setScalar(isSel ? 1.18 + Math.sin(elapsed * 4) * 0.05 : 1.0);
            (halo.material as THREE.MeshBasicMaterial).opacity = isSel ? 0.9 : 0.32;
          }

          const flagellum = mesh.getObjectByName('animated_flagellum');
          if (flagellum) {
            const mult = eng.currentSceneIdx === 5 ? eng.sliders[1] / 300 : 1.5;
            flagellum.rotation.x = elapsed * 8.0 * mult;
          }
        });

        // Scene-specific motion
        if (eng.currentSceneIdx === 0 && eng.envState.globe) {
          const flux = eng.sliders[1];
          eng.envState.globe.rotation.y = elapsed * 0.15 * flux;
          eng.envState.wireGlobe.rotation.y = -elapsed * 0.1 * flux;
          eng.envState.ring1.rotation.z = elapsed * 0.25 * flux;
          eng.envState.ring2.rotation.y = elapsed * 0.2 * flux;
        } else if (eng.currentSceneIdx === 1 && eng.envState.snowPoints) {
          const snowSpeed = (eng.sliders[1] / 85) * 0.7;
          const pos = eng.envState.snowPoints.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < pos.length / 3; i++) {
            pos[i * 3 + 1] -= dt * snowSpeed;
            if (pos[i * 3 + 1] < -5.5) pos[i * 3 + 1] = 5.5;
          }
          eng.envState.snowPoints.geometry.attributes.position.needsUpdate = true;
        } else if (eng.currentSceneIdx === 3 && eng.envState.streamPoints) {
          const flowSpeed = eng.sliders[0] * 2.4;
          const pos = eng.envState.streamPoints.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < pos.length / 3; i++) {
            pos[i * 3] += dt * flowSpeed;
            if (pos[i * 3] > -0.8) pos[i * 3] = -7.0;
          }
          eng.envState.streamPoints.geometry.attributes.position.needsUpdate = true;
        } else if (eng.currentSceneIdx === 4 && eng.envState.wedgePoints) {
          const mixing = eng.sliders[0] / 100;
          const pos = eng.envState.wedgePoints.geometry.attributes.position.array as Float32Array;
          const total = pos.length / 3;
          for (let i = 0; i < total; i++) {
            const isFresh = i < total / 2;
            pos[i * 3] += dt * (isFresh ? 1.4 : -1.1);
            if (pos[i * 3] > 6.0) pos[i * 3] = -6.0;
            if (pos[i * 3] < -6.0) pos[i * 3] = 6.0;
            pos[i * 3 + 1] += Math.sin(elapsed * 3 + i) * 0.015 * mixing;
          }
          eng.envState.wedgePoints.geometry.attributes.position.needsUpdate = true;
        }

        // Update screen-space floating HTML badges
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        eng.clickableMeshes.forEach((mesh, idx) => {
          const badge = eng.labelEls[idx];
          if (!badge) return;
          projVec.copy(mesh.position);
          projVec.y += 1.25;
          projVec.project(eng.camera);
          if (projVec.z > 1) {
            badge.style.opacity = '0';
            badge.style.pointerEvents = 'none';
            return;
          }
          const x = projVec.x * halfW + halfW;
          const y = -(projVec.y * halfH) + halfH;
          badge.style.left = `${x}px`;
          badge.style.top = `${y}px`;
          badge.style.opacity = '1';
          badge.style.pointerEvents = 'auto';
        });

        eng.renderer.render(eng.scene, eng.camera);
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [focusNode, switchScene]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        switchScene(sceneIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        switchScene(sceneIndex - 1);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < SCENES[sceneIndex].nodes.length) {
          focusNode(idx);
        }
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'Escape') {
        resetCamera();
      } else if (e.key === 'h' || e.key === 'H') {
        setIsDockHidden((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sceneIndex, switchScene, focusNode, resetCamera]);

  const s1Cfg = currentScene.sliderConfig[0];
  const s2Cfg = currentScene.sliderConfig[1];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#040b16] text-slate-100 select-none">
      {/* 1. THE 3D CANVAS IS THE SLIDE (100vw x 100vh) */}
      <canvas
        id="webgl-canvas"
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen block z-0 cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D Aquatic Microbiology Simulation"
      />

      {/* Floating 3D Object HTML Labels Layer */}
      <div
        id="labels-container"
        ref={labelsContainerRef}
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
      />

      {/* 2. HUD OVERLAY ONLY (pointer-events-none wrapper) */}
      <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between">
        {/* TOP-LEFT HUD */}
        <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="pointer-events-auto max-w-md bg-[#071324]/92 border border-slate-800/90 rounded-xl px-4 py-3.5 shadow-2xl">
            <div className="flex items-center justify-between gap-3 text-xs font-mono text-sky-400 tracking-tight mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold tabular-nums">
                  SCENE {String(currentScene.id).padStart(2, '0')} / {SCENES.length}
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span className="text-slate-400 font-sans">{currentScene.domain}</span>
              </div>
              <button
                type="button"
                onClick={resetCamera}
                title="Reset Camera View (Shortcut: R)"
                className="px-2 py-0.5 text-[11px] font-sans font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
              >
                Reset Camera
              </button>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              {currentScene.title}
            </h1>

            <p className="mt-1 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
              {currentScene.subtitle}
            </p>

            {/* Quick-Focus Node Buttons (Keys 1-4) */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
              {currentScene.nodes.map((nd, idx) => {
                const isSelected = selectedNodeIdx === idx;
                return (
                  <button
                    key={nd.id}
                    type="button"
                    onClick={() => focusNode(idx)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-sky-600/90 border-sky-400 text-white'
                        : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {idx + 1}. {nd.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top-Right Controls Hint */}
          <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-[#071324]/90 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-400">
            <span>Drag to Orbit</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span>Scroll to Zoom</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span>
              Keys <kbd className="font-mono text-slate-200">←</kbd>{' '}
              <kbd className="font-mono text-slate-200">→</kbd> &amp;{' '}
              <kbd className="font-mono text-slate-200">1–4</kbd>
            </span>
          </div>
        </div>

        {/* BOTTOM-CENTER FLOATING DOCK */}
        <div className="w-full flex flex-col items-center pb-4 px-3 sm:px-6">
          <button
            type="button"
            onClick={() => setIsDockHidden((prev) => !prev)}
            className="pointer-events-auto mb-1.5 px-3 py-1 rounded-t-lg bg-[#071324]/90 hover:bg-[#0c1e36] border border-b-0 border-slate-800/90 text-[11px] font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {isDockHidden ? '▴ Show Controls (H)' : '▾ Hide Controls (H)'}
          </button>

          <div
            className={`pointer-events-auto w-full max-w-[880px] bg-[#071324]/95 border border-slate-800/90 rounded-2xl px-4 py-3 shadow-2xl transition-transform duration-200 ${
              isDockHidden ? 'translate-y-[120%]' : 'translate-y-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
              {/* Prev / 15 Scene Dots / Next */}
              <div className="md:col-span-5 flex items-center justify-between gap-2 border-b md:border-b-0 md:border-r border-slate-800/80 pb-2.5 md:pb-0 md:pr-3.5">
                <button
                  type="button"
                  onClick={() => switchScene(sceneIndex - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  ← Prev
                </button>

                <div
                  className="flex items-center gap-1 flex-wrap justify-center px-1"
                  role="tablist"
                  aria-label="Scene navigation"
                >
                  {SCENES.map((sc, idx) => (
                    <button
                      key={sc.id}
                      type="button"
                      title={`${sc.id}. ${sc.title}`}
                      aria-label={`Scene ${sc.id}: ${sc.title}`}
                      onClick={() => switchScene(idx)}
                      className={
                        idx === sceneIndex
                          ? 'w-5 h-2 rounded-full bg-sky-400 transition-all'
                          : 'w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500 transition-all'
                      }
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => switchScene(sceneIndex + 1)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
                >
                  Next →
                </button>
              </div>

              {/* Live Simulation Sliders */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Slider 1 */}
                <div className="flex flex-col gap-1 bg-slate-900/70 border border-slate-800/70 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <label htmlFor="sim-slider-1" className="font-medium text-slate-300 truncate">
                      {s1Cfg.label}
                    </label>
                    <span className="font-mono text-sky-400 font-semibold tabular-nums whitespace-nowrap shrink-0">
                      {slider1Val} {s1Cfg.unit}
                    </span>
                  </div>
                  <input
                    id="sim-slider-1"
                    type="range"
                    min={s1Cfg.min}
                    max={s1Cfg.max}
                    step={s1Cfg.step}
                    value={slider1Val}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSlider1Val(v);
                      applySliderEffects(sceneIndex, v, slider2Val);
                    }}
                    className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Slider 2 */}
                <div className="flex flex-col gap-1 bg-slate-900/70 border border-slate-800/70 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <label htmlFor="sim-slider-2" className="font-medium text-slate-300 truncate">
                      {s2Cfg.label}
                    </label>
                    <span className="font-mono text-teal-400 font-semibold tabular-nums whitespace-nowrap shrink-0">
                      {slider2Val} {s2Cfg.unit}
                    </span>
                  </div>
                  <input
                    id="sim-slider-2"
                    type="range"
                    min={s2Cfg.min}
                    max={s2Cfg.max}
                    step={s2Cfg.step}
                    value={slider2Val}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSlider2Val(v);
                      applySliderEffects(sceneIndex, slider1Val, v);
                    }}
                    className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT DRAWER (Collapsible Inspector Panel, max-width 360px, hidden by default) */}
      <aside
        aria-label="3D Object Inspector"
        className={`fixed top-4 right-4 bottom-24 w-[calc(100vw-2rem)] max-w-[360px] z-30 bg-[#071324]/95 border border-slate-800/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          activeNode ? 'translate-x-0' : 'translate-x-[400px]'
        }`}
      >
        {activeNode && selectedNodeIdx !== null && (
          <>
            <div className="p-4 border-b border-slate-800/90 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-sky-400 font-mono mb-0.5">
                  <span>
                    OBJECT 0{selectedNodeIdx + 1} / 0{currentScene.nodes.length}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="text-slate-400">
                    {activeNode.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white leading-snug truncate">
                  {activeNode.label}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{activeNode.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeIdx(null)}
                aria-label="Close Inspector Drawer"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto flex flex-col justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono text-slate-400 mb-2">
                  Key Microbiological Properties
                </div>
                <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
                  {activeNode.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-2"
                    >
                      <span className="text-sky-400 font-mono text-xs mt-0.5 shrink-0">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {activeNode.chart.title}
                  </span>
                  <span className="text-[11px] font-mono text-sky-400 tabular-nums whitespace-nowrap shrink-0">
                    {slider1Val} {s1Cfg.unit}
                  </span>
                </div>
                <div className="relative w-full h-[165px]">
                  <canvas ref={chartCanvasRef} />
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-slate-800/90 bg-slate-950/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const len = currentScene.nodes.length;
                  focusNode((selectedNodeIdx - 1 + len) % len);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
              >
                ← Prev Object
              </button>
              <button
                type="button"
                onClick={resetCamera}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 transition-colors whitespace-nowrap shrink-0"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => {
                  const len = currentScene.nodes.length;
                  focusNode((selectedNodeIdx + 1) % len);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-sky-600/90 hover:bg-sky-500 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0"
              >
                Next Object →
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
