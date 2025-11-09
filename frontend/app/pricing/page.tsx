"use client";
import React, { useState } from "react";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown,
  ArrowRight
} from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out our platform",
      price: 0,
      icon: Sparkles,
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      borderColor: "border-slate-200 dark:border-slate-700",
      features: [
        "3 blogs per month",
        "Basic AI models",
        "Standard support",
        "Basic templates",
        "Email delivery"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      description: "For serious content creators",
      price: isAnnual ? 8 : 10,
      icon: Zap,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10",
      borderColor: "border-violet-200 dark:border-violet-700",
      features: [
        "Unlimited blog posts",
        "Advanced AI models",
        "SEO optimization tools",
        "Priority support",
        "Custom templates",
        "Analytics dashboard",
        "API access"
      ],
      cta: "Start Free Trial",
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-500/10 px-4 py-2 rounded-full mb-6">
            <Crown className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">
            Choose Your <span className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                !isAnnual 
                  ? "bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-md" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 relative ${
                isAnnual 
                  ? "bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-md" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 border-2 transition-all duration-500 hover:scale-105 ${
                plan.popular 
                  ? "shadow-2xl shadow-violet-500/20 dark:shadow-violet-500/10" 
                  : "shadow-lg"
              } ${plan.bgColor} ${plan.borderColor}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-linear-to-r from-violet-500 to-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    /{isAnnual ? "year" : "month"}
                  </span>
                </div>
                {plan.price > 0 && isAnnual && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                    Save ${(10 * 12 - 8 * 12)} per year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
                  plan.popular
                    ? "bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* FAQ or Trust Section */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;