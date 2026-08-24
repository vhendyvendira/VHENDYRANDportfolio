import React from 'react';

export interface CaseStudy {
  id: number;
  index: string;
  title: string;
  tags: string[];
  year: string;
  duration: string;
  role: string;
  event: string;
  description: string;
  context: string;
  problem?: string;
  opportunity?: string;
  challenge?: string;
  approach?: string;
  strategy?: string;
  utility?: string;
  expansion?: string;
  system?: string;
  outcome: string;
  team: string;
  tools: string[];
  projectType: string;
  gallery?: string[];
  color: string;
  image: string;
  slug: string;
  videoUrl?: string;
  externalLink?: string;
  tracks?: { name: string; classes: number }[];
}

export interface Social {
  label: string;
  href: string;
  icon: React.ReactNode;
}
