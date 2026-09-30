import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CostCard from '../components/CostCard';
import { MinimumCost } from '../lib/utils';
import React from 'react';

// Mock matchMedia required by framer-motion in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver required by framer-motion in JSDOM
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

const mockCost: MinimumCost = {
  basePrice: 100,
  sizeAdjustment: 20,
  designPremium: 0,
  totalCost: 120,
  industryMultiplier: 1.0,
  isLive: false,
};

const mockDimensions = {
  length: 10,
  width: 10,
  height: 10,
};

describe('CostCard Component', () => {
  it('renders the total cost correctly', () => {
    render(<CostCard cost={mockCost} productName="Test Box" dimensions={mockDimensions} />);
    
    // Check if the total cost is displayed
    expect(screen.getByText('₹120.00')).toBeInTheDocument();
  });

  it('displays the product name and dimensions', () => {
    render(<CostCard cost={mockCost} productName="Test Box" dimensions={mockDimensions} />);
    
    expect(screen.getByText('Test Box · 10 × 10 × 10 cm')).toBeInTheDocument();
  });

  it('conditionally renders the design premium if greater than 0', () => {
    const costWithDesign = { ...mockCost, designPremium: 50, totalCost: 170 };
    render(<CostCard cost={costWithDesign} productName="Design Box" dimensions={mockDimensions} />);
    
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
    expect(screen.getByText('Custom Design')).toBeInTheDocument();
  });

  it('does not render design premium if it is 0', () => {
    render(<CostCard cost={mockCost} productName="Test Box" dimensions={mockDimensions} />);
    
    expect(screen.queryByText('Custom Design')).not.toBeInTheDocument();
  });
});
