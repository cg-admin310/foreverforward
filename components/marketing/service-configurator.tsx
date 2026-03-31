"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  School,
  Church,
  Heart,
  Users,
  Server,
  Cable,
  Cctv,
  Laptop,
  Code,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// Organization types
const ORG_TYPES = [
  {
    id: "nonprofit",
    label: "Nonprofit Organization",
    icon: Heart,
    description: "501(c)(3) organizations serving communities",
    discount: "Microsoft 365 Nonprofit pricing available",
  },
  {
    id: "school",
    label: "School / Educational",
    icon: School,
    description: "K-12 schools, charter schools, educational programs",
    discount: "Education licensing & special rates",
  },
  {
    id: "church",
    label: "Faith-Based Organization",
    icon: Church,
    description: "Churches, mosques, synagogues, and religious institutions",
    discount: "Nonprofit pricing eligible",
  },
  {
    id: "community",
    label: "Community Organization",
    icon: Building2,
    description: "Neighborhood associations, community centers, local groups",
    discount: "Community-focused packages available",
  },
];

// User count ranges
const USER_COUNTS = [
  { id: "small", label: "1-15 Users", value: 8, description: "Small team or startup" },
  { id: "medium", label: "15-40 Users", value: 27, description: "Growing organization" },
  { id: "large", label: "40-75 Users", value: 55, description: "Established organization" },
  { id: "enterprise", label: "75+ Users", value: 100, description: "Large enterprise" },
];

// Services available
const SERVICES = [
  {
    id: "managed-it",
    label: "Managed IT Support",
    icon: Server,
    description: "24/7 helpdesk, monitoring, maintenance, security",
    pricePerUser: { small: 200, medium: 75, large: 60, enterprise: 50 },
    monthlyBase: 0,
    required: false,
    popular: true,
  },
  {
    id: "microsoft-365",
    label: "Microsoft 365 Management",
    icon: Shield,
    description: "Email, Teams, SharePoint setup & administration",
    pricePerUser: { small: 0, medium: 0, large: 0, enterprise: 0 },
    monthlyBase: 250,
    required: false,
    popular: true,
    note: "Licensing separate, nonprofit rates apply",
  },
  {
    id: "it-refresh",
    label: "IT Refresh / Device Rollout",
    icon: Laptop,
    description: "New device setup, imaging, data migration",
    pricePerDevice: 125,
    oneTime: true,
    required: false,
  },
  {
    id: "cabling",
    label: "Structured Cabling",
    icon: Cable,
    description: "Cat6 network drops, cable runs, patch panels",
    pricePerDrop: 200,
    oneTime: true,
    required: false,
  },
  {
    id: "cctv",
    label: "CCTV / Security Systems",
    icon: Cctv,
    description: "Security cameras, NVR, remote monitoring",
    basePrice: 3500,
    oneTime: true,
    required: false,
  },
  {
    id: "software-dev",
    label: "Software & AI Development",
    icon: Code,
    description: "Custom applications, AI integrations, automation",
    basePrice: 5000,
    oneTime: true,
    required: false,
    note: "Price varies by project scope",
  },
];

type OrgType = (typeof ORG_TYPES)[number]["id"];
type UserCountSize = (typeof USER_COUNTS)[number]["id"];
type ServiceId = (typeof SERVICES)[number]["id"];

interface ConfigState {
  orgType: OrgType | null;
  userCount: UserCountSize | null;
  services: ServiceId[];
  deviceCount: number;
  cableDrops: number;
}

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              idx < currentStep
                ? "bg-brand-gold text-brand-black"
                : idx === currentStep
                ? "bg-brand-black text-white ring-4 ring-brand-gold/30"
                : "bg-brand-warm text-brand-text-light"
            }`}
            animate={{
              scale: idx === currentStep ? 1.1 : 1,
            }}
          >
            {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
          </motion.div>
          {idx < totalSteps - 1 && (
            <div
              className={`w-12 h-1 rounded-full transition-colors ${
                idx < currentStep ? "bg-brand-gold" : "bg-brand-warm"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Option card component
function OptionCard({
  selected,
  onClick,
  icon: Icon,
  label,
  description,
  badge,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full p-5 rounded-xl border-2 text-left transition-all duration-300 ${
        selected
          ? "border-brand-gold bg-brand-gold/5 shadow-lg shadow-brand-gold/10"
          : "border-brand-border bg-white hover:border-brand-gold/50 hover:shadow-md"
      }`}
    >
      {badge && (
        <span className="absolute -top-2 right-4 px-2 py-0.5 bg-brand-gold text-brand-black text-xs font-bold rounded-full">
          {badge}
        </span>
      )}

      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={`p-3 rounded-xl transition-colors ${
              selected ? "bg-brand-gold text-brand-black" : "bg-brand-warm text-brand-text-medium"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-brand-black">{label}</h4>
            {selected && <Check className="w-5 h-5 text-brand-gold" />}
          </div>
          {description && (
            <p className="text-sm text-brand-text-medium mt-1">{description}</p>
          )}
          {children}
        </div>
      </div>
    </motion.button>
  );
}

// Service toggle component
function ServiceToggle({
  service,
  selected,
  onToggle,
  userSize,
  deviceCount,
  cableDrops,
  onDeviceChange,
  onCableChange,
}: {
  service: (typeof SERVICES)[number];
  selected: boolean;
  onToggle: () => void;
  userSize: UserCountSize | null;
  deviceCount: number;
  cableDrops: number;
  onDeviceChange: (count: number) => void;
  onCableChange: (count: number) => void;
}) {
  const Icon = service.icon;
  const showDeviceInput = selected && service.id === "it-refresh";
  const showCableInput = selected && service.id === "cabling";

  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
        selected
          ? "border-brand-gold bg-brand-gold/5"
          : "border-brand-border bg-white hover:border-brand-gold/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`p-2.5 rounded-lg transition-colors ${
            selected ? "bg-brand-gold text-brand-black" : "bg-brand-warm text-brand-text-medium"
          }`}
        >
          <Icon className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-brand-black flex items-center gap-2">
                {service.label}
                {service.popular && (
                  <span className="px-2 py-0.5 bg-brand-olive/10 text-brand-olive text-xs rounded-full">
                    Popular
                  </span>
                )}
              </h4>
              <p className="text-sm text-brand-text-medium">{service.description}</p>
              {service.note && (
                <p className="text-xs text-brand-gold mt-1">{service.note}</p>
              )}
            </div>

            <button
              onClick={onToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selected
                  ? "bg-brand-gold text-brand-black"
                  : "bg-brand-warm text-brand-text-medium hover:bg-brand-gold/20"
              }`}
            >
              {selected ? "Selected" : "Add"}
            </button>
          </div>

          {/* Device count input for IT Refresh */}
          <AnimatePresence>
            {showDeviceInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-brand-border"
              >
                <label className="block text-sm text-brand-text-medium mb-2">
                  Number of devices to refresh:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={deviceCount}
                  onChange={(e) => onDeviceChange(Math.max(1, Number(e.target.value)))}
                  className="w-32 px-4 py-2 border border-brand-border rounded-lg focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cable drops input */}
          <AnimatePresence>
            {showCableInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-brand-border"
              >
                <label className="block text-sm text-brand-text-medium mb-2">
                  Number of network drops:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={cableDrops}
                  onChange={(e) => onCableChange(Math.max(1, Number(e.target.value)))}
                  className="w-32 px-4 py-2 border border-brand-border rounded-lg focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Estimate display component
function EstimateDisplay({ config }: { config: ConfigState }) {
  const estimate = useMemo(() => {
    if (!config.userCount) return null;

    const userCountData = USER_COUNTS.find((u) => u.id === config.userCount);
    if (!userCountData) return null;

    let monthlyTotal = 0;
    let oneTimeTotal = 0;
    const breakdown: { name: string; amount: number; type: "monthly" | "one-time" }[] = [];

    config.services.forEach((serviceId) => {
      const service = SERVICES.find((s) => s.id === serviceId);
      if (!service) return;

      if (service.pricePerUser && config.userCount) {
        const pricePerUser = service.pricePerUser[config.userCount as keyof typeof service.pricePerUser];
        const amount = pricePerUser * userCountData.value;
        monthlyTotal += amount;
        breakdown.push({ name: service.label, amount, type: "monthly" });
      }

      if (service.monthlyBase) {
        monthlyTotal += service.monthlyBase;
        breakdown.push({ name: service.label, amount: service.monthlyBase, type: "monthly" });
      }

      if (service.pricePerDevice && serviceId === "it-refresh") {
        const amount = service.pricePerDevice * config.deviceCount;
        oneTimeTotal += amount;
        breakdown.push({ name: `${service.label} (${config.deviceCount} devices)`, amount, type: "one-time" });
      }

      if (service.pricePerDrop && serviceId === "cabling") {
        const amount = service.pricePerDrop * config.cableDrops;
        oneTimeTotal += amount;
        breakdown.push({ name: `${service.label} (${config.cableDrops} drops)`, amount, type: "one-time" });
      }

      if (service.basePrice && !service.pricePerUser && !service.pricePerDevice && !service.pricePerDrop) {
        oneTimeTotal += service.basePrice;
        breakdown.push({ name: service.label, amount: service.basePrice, type: "one-time" });
      }
    });

    return { monthlyTotal, oneTimeTotal, breakdown };
  }, [config]);

  if (!estimate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/20 via-brand-olive/10 to-brand-gold/20 rounded-3xl blur-xl opacity-60" />

      <div className="relative bg-white rounded-2xl border border-brand-gold/30 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-gold rounded-lg">
            <Calculator className="w-5 h-5 text-brand-black" />
          </div>
          <h3 className="text-lg font-bold text-brand-black">Your Estimate</h3>
        </div>

        {/* Totals */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {estimate.monthlyTotal > 0 && (
            <div className="p-4 bg-brand-olive-bg rounded-xl">
              <p className="text-sm text-brand-text-medium mb-1">Monthly Investment</p>
              <p className="text-3xl font-bold text-brand-olive">
                ${estimate.monthlyTotal.toLocaleString()}
                <span className="text-sm font-normal">/mo</span>
              </p>
            </div>
          )}
          {estimate.oneTimeTotal > 0 && (
            <div className="p-4 bg-brand-gold-bg rounded-xl">
              <p className="text-sm text-brand-text-medium mb-1">One-Time Setup</p>
              <p className="text-3xl font-bold text-brand-gold-dark">
                ${estimate.oneTimeTotal.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Breakdown */}
        {estimate.breakdown.length > 0 && (
          <div className="border-t border-brand-border pt-4">
            <p className="text-sm font-medium text-brand-text-medium mb-3">Breakdown:</p>
            <div className="space-y-2">
              {estimate.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-brand-text-medium">{item.name}</span>
                  <span className="font-medium text-brand-black">
                    ${item.amount.toLocaleString()}
                    {item.type === "monthly" && "/mo"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-brand-text-light">
          * Estimates are approximate. Final pricing based on detailed assessment.
        </p>
      </div>
    </motion.div>
  );
}

// Main Service Configurator Component
export function ServiceConfigurator() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<ConfigState>({
    orgType: null,
    userCount: null,
    services: [],
    deviceCount: 20,
    cableDrops: 10,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const totalSteps = 4;

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return config.orgType !== null;
      case 1:
        return config.userCount !== null;
      case 2:
        return config.services.length > 0;
      default:
        return true;
    }
  }, [step, config]);

  const toggleService = (serviceId: ServiceId) => {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const stepContent = [
    // Step 1: Organization Type
    <motion.div
      key="step-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold text-brand-black mb-2">What type of organization are you?</h3>
      <p className="text-brand-text-medium mb-6">This helps us tailor pricing and solutions to your needs.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {ORG_TYPES.map((org) => (
          <OptionCard
            key={org.id}
            selected={config.orgType === org.id}
            onClick={() => setConfig((prev) => ({ ...prev, orgType: org.id }))}
            icon={org.icon}
            label={org.label}
            description={org.description}
          >
            <p className="text-xs text-brand-gold mt-2">{org.discount}</p>
          </OptionCard>
        ))}
      </div>
    </motion.div>,

    // Step 2: User Count
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold text-brand-black mb-2">How many users do you have?</h3>
      <p className="text-brand-text-medium mb-6">Include staff, volunteers, and anyone who needs IT support.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {USER_COUNTS.map((count) => (
          <OptionCard
            key={count.id}
            selected={config.userCount === count.id}
            onClick={() => setConfig((prev) => ({ ...prev, userCount: count.id }))}
            icon={Users}
            label={count.label}
            description={count.description}
          />
        ))}
      </div>
    </motion.div>,

    // Step 3: Services
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h3 className="text-2xl font-bold text-brand-black mb-2">What services do you need?</h3>
      <p className="text-brand-text-medium mb-6">Select all that apply. We'll create a custom package.</p>

      <div className="space-y-3">
        {SERVICES.map((service) => (
          <ServiceToggle
            key={service.id}
            service={service}
            selected={config.services.includes(service.id)}
            onToggle={() => toggleService(service.id)}
            userSize={config.userCount}
            deviceCount={config.deviceCount}
            cableDrops={config.cableDrops}
            onDeviceChange={(count) => setConfig((prev) => ({ ...prev, deviceCount: count }))}
            onCableChange={(count) => setConfig((prev) => ({ ...prev, cableDrops: count }))}
          />
        ))}
      </div>
    </motion.div>,

    // Step 4: Results
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid lg:grid-cols-2 gap-8"
    >
      <div>
        <h3 className="text-2xl font-bold text-brand-black mb-2">Your Custom IT Package</h3>
        <p className="text-brand-text-medium mb-6">
          Based on your selections, here's your estimated investment. Let's schedule a free assessment
          to finalize your package.
        </p>

        {/* Summary */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-brand-warm rounded-xl">
            <p className="text-sm text-brand-text-medium">Organization Type</p>
            <p className="font-semibold text-brand-black">
              {ORG_TYPES.find((o) => o.id === config.orgType)?.label}
            </p>
          </div>
          <div className="p-4 bg-brand-warm rounded-xl">
            <p className="text-sm text-brand-text-medium">Team Size</p>
            <p className="font-semibold text-brand-black">
              {USER_COUNTS.find((u) => u.id === config.userCount)?.label}
            </p>
          </div>
          <div className="p-4 bg-brand-warm rounded-xl">
            <p className="text-sm text-brand-text-medium">Selected Services</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {config.services.map((serviceId) => {
                const service = SERVICES.find((s) => s.id === serviceId);
                return service ? (
                  <span
                    key={serviceId}
                    className="px-3 py-1 bg-brand-gold/20 text-brand-gold-dark text-sm font-medium rounded-full"
                  >
                    {service.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      <EstimateDisplay config={config} />
    </motion.div>,
  ];

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-offwhite via-white to-brand-offwhite" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,168,76,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium text-brand-gold-dark">Build Your Package</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-brand-black mb-6">
            Configure Your <span className="text-brand-gold">IT Solution</span>
          </h2>
          <p className="text-lg text-brand-text-medium leading-relaxed">
            Answer a few questions and we'll estimate your investment. No obligations — just clarity on
            what modern IT support costs.
          </p>
        </motion.div>

        {/* Configurator */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-gold/10 via-brand-olive/5 to-brand-gold/10 rounded-3xl blur-2xl" />

            {/* Card */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-brand-border shadow-xl p-8">
              <StepIndicator currentStep={step} totalSteps={totalSteps} />

              <AnimatePresence mode="wait">{stepContent[step]}</AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-brand-border">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    step === 0
                      ? "text-brand-text-light cursor-not-allowed"
                      : "text-brand-text-medium hover:text-brand-black hover:bg-brand-warm"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                {step < totalSteps - 1 ? (
                  <button
                    onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
                    disabled={!canProceed}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                      canProceed
                        ? "bg-brand-gold text-brand-black hover:bg-brand-gold-dark shadow-md hover:shadow-lg"
                        : "bg-brand-warm text-brand-text-light cursor-not-allowed"
                    }`}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <Link
                    href="/services/free-assessment"
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-brand-black font-semibold rounded-xl hover:bg-brand-gold-dark transition-all shadow-md hover:shadow-lg"
                  >
                    Get Free Assessment
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-brand-text-medium"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-olive" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-olive" />
              <span>Free on-site assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-olive" />
              <span>30+ nonprofits served</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ServiceConfigurator;
