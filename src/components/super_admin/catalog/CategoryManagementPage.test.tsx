import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CategoryManagementPage } from './CategoryManagementPage';
import '@testing-library/jest-dom';

// Mock alert
global.alert = vi.fn();

describe('CategoryManagementPage CRUD & Validation', () => {
  it('renders correctly with initial registry data', () => {
    render(<CategoryManagementPage />);
    expect(screen.getByText('Categories')).toBeDefined();
    // Use getAllByText since "Barber" might appear in multiple places (Name, Slug)
    const barberElements = screen.getAllByText(/Barber/i);
    expect(barberElements.length).toBeGreaterThan(0);
  });

  it('shows validation errors when creating a category with existing slug', async () => {
    render(<CategoryManagementPage />);
    
    fireEvent.click(screen.getByText(/Add Category/i));

    const nameInput = screen.getByPlaceholderText(/Yoga Studio/i);
    const slugInput = screen.getByPlaceholderText(/yoga-studio/i);
    const form = screen.getByLabelText(/Category Form/i);

    // Use an existing slug like 'barber'
    fireEvent.change(nameInput, { target: { value: 'New Barber' } });
    fireEvent.change(slugInput, { target: { value: 'barber' } });
    
    fireEvent.submit(form);

    expect(await screen.findByText(/This slug is already taken/i)).toBeDefined();
  });

  it('validates slug format (only lowercase, numbers, hyphens)', async () => {
    render(<CategoryManagementPage />);
    
    fireEvent.click(screen.getByText(/Add Category/i));

    const slugInput = screen.getByPlaceholderText(/yoga-studio/i);
    const form = screen.getByLabelText(/Category Form/i);

    fireEvent.change(slugInput, { target: { value: 'Invalid Slug!' } });
    fireEvent.submit(form);

    expect(await screen.findByText(/Slug must contain only lowercase letters/i)).toBeDefined();
  });

  it('successfully creates a new category when validation passes', async () => {
    render(<CategoryManagementPage />);
    
    fireEvent.click(screen.getByText(/Add Category/i));

    fireEvent.change(screen.getByPlaceholderText(/Yoga Studio/i), { target: { value: 'Meditation' } });
    fireEvent.change(screen.getByPlaceholderText(/yoga-studio/i), { target: { value: 'meditation' } });
    fireEvent.change(screen.getByPlaceholderText(/Brief overview/i), { target: { value: 'A peaceful space' } });
    
    fireEvent.click(screen.getByText(/Create Category/i));

    // Success alert should be called
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('created in current session'));
    
    // Modal should be closed and new category should appear in table
    expect(screen.getByText('Meditation')).toBeDefined();
  });

  it('prevents deactivation of categories in use', () => {
    render(<CategoryManagementPage />);
    
    // Find 'barber' row and click deactivate (Power icon)
    // We search for the row containing 'barber' slug
    const barberRow = screen.getByText('barber').closest('tr');
    const deactivateButton = barberRow?.querySelector('button[title="Deactivate"]');
    
    if (deactivateButton) {
      fireEvent.click(deactivateButton);
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Safety Lock'));
    }
  });
});
