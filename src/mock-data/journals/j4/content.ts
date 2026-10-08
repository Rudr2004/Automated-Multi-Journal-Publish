// Journal 4 research-area profiles; the article builder itself is shared (mock-data/shared/buildFull).
import { createBuildFull, type Profile } from '../../shared/buildFull'
import { INSTITUTIONS, SUBJECTS, allArticles } from './articles'

const [CIV, MEC, ELE, EMB, CMP, IND, OPS, PRJ, INF] = SUBJECTS

const P: Record<string, Profile> = {
  [CIV]: {
    field: 'civil and structural engineering', problem: 'the need to judge the remaining capacity of ageing and heavily loaded structures', gap: 'few long-duration field measurements that tie observed structural response to design assumptions',
    approach: 'experimental testing combined with calibrated finite element modelling', setup: 'scaled specimens were tested under controlled loading and the measured responses were used to calibrate a numerical model, which was then checked against field measurements',
    metric: 'damage detection accuracy', unit: '%', groups: ['Baseline check', 'Static test', 'Frequency-based method', 'Mode-shape method', 'Combined model-updating'],
    keywords: ['structural health monitoring', 'modal analysis', 'reinforced concrete', 'finite element modelling', 'bridge condition'],
    refJournals: ['Engineering Structures', 'Journal of Structural Engineering', 'Structural Health Monitoring', 'Construction and Building Materials'],
    params: [['Specimens', '9 scaled members', 'Cast in one batch'], ['Loading', 'Static and cyclic', 'Displacement controlled'], ['Instrumentation', 'Strain gauges and accelerometers', 'Sampled at 200 Hz'], ['Model', 'Nonlinear finite element', 'Calibrated on measured response']],
  },
  [MEC]: {
    field: 'mechanical and manufacturing engineering', problem: 'the pressure to raise productivity and quality while limiting energy use and waste', gap: 'limited evidence from small and mid-sized plants running mixed product families',
    approach: 'controlled process trials with shop-floor measurement', setup: 'machining and assembly trials were run at planned parameter settings while cycle times, scrap and energy use were logged by operators and sensors',
    metric: 'throughput', unit: 'units/h', groups: ['Current practice', 'Revised sequence', 'Cell layout A', 'Cell layout B', 'Optimised cell'],
    keywords: ['lean manufacturing', 'process optimisation', 'machining', 'equipment effectiveness', 'additive manufacturing'],
    refJournals: ['International Journal of Production Research', 'Journal of Manufacturing Systems', 'Journal of Materials Processing Technology', 'International Journal of Machine Tools and Manufacture'],
    params: [['Plant', '2 production lines', 'Automotive components'], ['Trials', '27 runs', 'Randomised run order'], ['Measures', 'Cycle time, scrap, energy', 'Logged per shift'], ['Analysis', 'ANOVA and regression', 'Significance at 5%']],
  },
  [ELE]: {
    field: 'electrical and power systems engineering', problem: 'the growing share of renewable generation, storage and flexible loads connected to distribution networks', gap: 'little validation of proposed control and sizing methods against measured feeder data',
    approach: 'detailed network simulation validated against recorded load data', setup: 'a time-domain model of the feeder was built from utility data, validated against a week of measurements and then used to compare control and sizing strategies',
    metric: 'renewable utilisation', unit: '%', groups: ['No coordination', 'Local droop control', 'Rule-based dispatch', 'Forecast-based dispatch', 'Coordinated optimisation'],
    keywords: ['microgrids', 'power systems', 'renewable integration', 'load forecasting', 'voltage regulation'],
    refJournals: ['IEEE Transactions on Power Systems', 'Applied Energy', 'IEEE Transactions on Smart Grid', 'Electric Power Systems Research'],
    params: [['Network', '33-bus feeder', 'Radial, 11 kV'], ['Generation', '1.2 MW rooftop solar', 'Plus 0.8 MWh storage'], ['Data', 'One year of hourly load', 'From the distribution utility'], ['Solver', 'Mixed-integer programming', 'Run on a standard workstation']],
  },
  [EMB]: {
    field: 'electronics and embedded systems', problem: 'the demand for dense, long-lived and low-cost sensing in places that were once impractical to instrument', gap: 'few reports that carry prototype nodes from the bench to extended field deployment',
    approach: 'prototype design with bench testing and field deployment', setup: 'nodes were built around a low-power microcontroller, calibrated on the bench against reference instruments and then installed in the field for several weeks',
    metric: 'measurement accuracy', unit: '%', groups: ['Uncalibrated node', 'Offset calibration', 'Gain calibration', 'Temperature compensated', 'Fused multi-sensor'],
    keywords: ['embedded sensing', 'wireless sensor networks', 'low-power design', 'energy harvesting', 'microcontrollers'],
    refJournals: ['IEEE Sensors Journal', 'Sensors and Actuators A: Physical', 'IEEE Internet of Things Journal', 'Microelectronics Journal'],
    params: [['Platform', '32-bit low-power MCU', 'Sleep current below 5 µA'], ['Sensors', 'MEMS strain and temperature', 'Factory calibrated'], ['Radio', 'Sub-GHz link', 'Star topology'], ['Deployment', '6 weeks outdoors', 'Battery and harvester']],
  },
  [CMP]: {
    field: 'computer and control engineering', problem: 'the dependence of modern plants on control software and data-driven models that must be dependable as well as accurate', gap: 'limited evaluation of proposed controllers and detectors on realistic laboratory test beds',
    approach: 'controller design with simulation and test-bed evaluation', setup: 'the controller or monitoring model was designed in simulation, tuned on recorded signals and then evaluated on a laboratory test bed under varying operating conditions',
    metric: 'detection accuracy', unit: '%', groups: ['Fixed-threshold baseline', 'Statistical monitor', 'Classical classifier', 'Lightweight neural model', 'Tuned ensemble'],
    keywords: ['industrial automation', 'model predictive control', 'digital twin', 'anomaly detection', 'programmable logic controllers'],
    refJournals: ['IEEE Transactions on Industrial Informatics', 'Control Engineering Practice', 'Automatica', 'IEEE Transactions on Automation Science and Engineering'],
    params: [['Test bed', 'Batch process rig', 'Two PLCs and a SCADA host'], ['Signals', '48 logged channels', 'Sampled at 10 Hz'], ['Scenarios', '12 fault and load cases', 'Repeated three times'], ['Software', 'IEC 61131-3 and Python', 'Version controlled']],
  },
  [IND]: {
    field: 'industrial and systems engineering', problem: 'the need to balance productivity, quality, safety and cost across complex production systems', gap: 'few studies that combine time-study data with simulation of whole workflows',
    approach: 'time studies and discrete-event simulation', setup: 'work cycles were timed on the shop floor, the system was modelled in simulation and redesigned layouts and schedules were tested over replicated runs',
    metric: 'line efficiency', unit: '%', groups: ['Current layout', 'Rebalanced stations', 'Revised buffers', 'Revised schedule', 'Integrated redesign'],
    keywords: ['industrial engineering', 'scheduling', 'simulation', 'line balancing', 'maintenance planning'],
    refJournals: ['Computers & Industrial Engineering', 'International Journal of Production Economics', 'IISE Transactions', 'Journal of Manufacturing Systems'],
    params: [['Setting', '3 fabrication plants', 'Make-to-order products'], ['Time study', '420 observed cycles', 'Stopwatch and video'], ['Simulation', '30 replications', 'Warm-up removed'], ['Interviews', '14 supervisors', 'Semi-structured']],
  },
  [OPS]: {
    field: 'operations and supply chain management', problem: 'the need for decisions that hold up under uncertain demand, variable lead times and disruption', gap: 'limited testing of proposed policies on real industry data rather than generated instances alone',
    approach: 'optimisation modelling with a heuristic solution method', setup: 'the problem was formulated as a mathematical model, solved with a heuristic and tested on company data and generated instances of increasing size',
    metric: 'service level', unit: '%', groups: ['Current rule of thumb', 'Fixed reorder policy', 'Safety-stock policy', 'Stochastic model', 'Robust model'],
    keywords: ['supply chain optimisation', 'inventory control', 'logistics', 'operations research', 'supply chain resilience'],
    refJournals: ['International Journal of Production Research', 'European Journal of Operational Research', 'Transportation Research Part E', 'Journal of Operations Management'],
    params: [['Data', '24 months of demand', 'From a distributor'], ['Instances', '60 generated cases', 'Up to 200 nodes'], ['Solver', 'Tabu search heuristic', 'Benchmarked against exact solution'], ['Measures', 'Cost and service level', 'Averaged over 30 runs']],
  },
  [PRJ]: {
    field: 'project and engineering management', problem: 'the frequent schedule and cost overruns of engineering projects and their organisational causes', gap: 'few studies that link early management practices to measured project outcomes',
    approach: 'a survey of project professionals with analysis of project records', setup: 'a questionnaire was sent to project managers, records from completed projects were reviewed and a subset of managers was interviewed to interpret the findings',
    metric: 'schedule variance reduction', unit: '%', groups: ['No formal risk process', 'Risk register only', 'Register with reviews', 'Reviews with contract controls', 'Full risk management'],
    keywords: ['project risk management', 'construction management', 'schedule performance', 'earned value', 'stakeholder engagement'],
    refJournals: ['International Journal of Project Management', 'Journal of Construction Engineering and Management', 'Construction Management and Economics', 'Engineering Management Journal'],
    params: [['Survey', 'n = 164 professionals', 'Response rate 38%'], ['Records', '52 completed projects', 'Construction and utilities'], ['Interviews', '15 project managers', 'Recorded with consent'], ['Analysis', 'Regression and thematic coding', 'Reliability checked']],
  },
  [INF]: {
    field: 'smart and sustainable infrastructure', problem: 'the push to make water, road and building systems more efficient, more resilient and lower in carbon', gap: 'limited field evidence on the performance of data-driven monitoring and low-carbon materials over time',
    approach: 'field measurement with life-cycle accounting and a calibrated system model', setup: 'monitoring devices were installed at operating sites, emissions were accounted over the life cycle and a calibrated model was used to extend the results to other scenarios',
    metric: 'loss reduction', unit: '%', groups: ['Business as usual', 'Periodic inspection', 'Sensor-based alerts', 'Model-assisted alerts', 'Integrated monitoring and control'],
    keywords: ['smart infrastructure', 'life-cycle assessment', 'water networks', 'digital twins', 'sustainable materials'],
    refJournals: ['Automation in Construction', 'Sustainable Cities and Society', 'Journal of Cleaner Production', 'Water Research'],
    params: [['Sites', '5 monitored sites', 'Urban and peri-urban'], ['Sensing', 'Pressure and flow loggers', 'Fifteen-minute interval'], ['Accounting', 'ISO 14040 framework', 'Cradle to gate'], ['Model', 'Calibrated hydraulic model', 'Validated on held-out weeks']],
  },
}

export const KEYWORDS: string[] = [...new Set(Object.values(P).flatMap((p) => p.keywords))]

export const buildFull = createBuildFull(P, INSTITUTIONS, () => allArticles)
