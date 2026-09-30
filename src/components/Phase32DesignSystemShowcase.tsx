import React, { useState } from 'react';
import {
  CATEGORY_THEMES,
  CategoryThemeKey,
  SPACING_SCALE,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Badge,
  Card,
  Modal,
  Drawer,
  Tabs,
  Dropdown,
  Tooltip,
  Alert,
  Toast,
  Avatar,
  Skeleton,
  EmptyState,
  ErrorState,
  LoadingState,
  Table,
  Pagination,
  Typography
} from '../design-system';
import {
  Sparkles,
  Scissors,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const Phase32DesignSystemShowcase: React.FC = () => {
  const [selectedThemeKey, setSelectedThemeKey] = useState<CategoryThemeKey>('barber');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('primitives');
  const [switchState, setSwitchState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('option-1');
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const currentTheme = CATEGORY_THEMES[selectedThemeKey];

  return (
    <div className="space-y-6 text-left">
      {/* Scope Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Phase 3.2 Implementation Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">23 Primitives · 10 Category Themes</span>
            </div>
            <Typography variant="h1" className="text-white">
              Production Design System & Component Library
            </Typography>
            <Typography variant="small" className="text-slate-400 mt-1 max-w-3xl">
              Type-safe, accessible primitives with complete keyboard focus management, ARIA roles, error states, and responsive token bindings across all 10 salon categories.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Category Theme:</span>
            <select
              value={selectedThemeKey}
              onChange={(e) => setSelectedThemeKey(e.target.value as CategoryThemeKey)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-amber-300 cursor-pointer"
            >
              {Object.keys(CATEGORY_THEMES).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_THEMES[key as CategoryThemeKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <Tabs
        tabs={[
          { id: 'primitives', label: '1. UI Primitives & Form Controls', badge: '12' },
          { id: 'overlays', label: '2. Overlays & Navigation', badge: '6' },
          { id: 'feedback', label: '3. Data Display & States', badge: '5' },
          { id: 'themes', label: '4. 10 Category Themes & Tokens', badge: '10' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: FORM & ACTION PRIMITIVES */}
      {activeTab === 'primitives' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons Card */}
          <Card padding="md" className="space-y-4">
            <Typography variant="h3">Buttons (Variants, Sizes & States)</Typography>
            <div className="flex flex-wrap gap-2.5 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-2.5 items-center pt-2 border-t border-slate-100">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button isLoading size="sm">Loading</Button>
              <Button disabled size="sm">Disabled</Button>
            </div>
          </Card>

          {/* Form Inputs Card */}
          <Card padding="md" className="space-y-3">
            <Typography variant="h3">Inputs & Textarea (Accessible Labels)</Typography>
            <Input
              label="Customer Full Name"
              placeholder="e.g. Rahul Kapoor"
              hint="Required for salon appointment check-in"
              required
            />
            <Input
              label="Promo Code"
              placeholder="FESTIVE25"
              error="Invalid code for signature services"
            />
            <Textarea
              label="Hair & Scalp Consultation Notes"
              placeholder="Mention sensitive skin, allergies, or styling preferences..."
              rows={2}
            />
          </Card>

          {/* Select & Switch Card */}
          <Card padding="md" className="space-y-4">
            <Typography variant="h3">Select & Toggles</Typography>
            <Select
              label="Selected Treatment Category"
              options={[
                { value: 'fade', label: 'Signature Skin Fade (45m)' },
                { value: 'beard', label: 'Traditional Beard Sculpt (30m)' },
                { value: 'spa', label: 'Restorative Head Spa (50m)' }
              ]}
            />
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <Switch
                checked={switchState}
                onChange={setSwitchState}
                label="Online Advance Deposit Required"
                description="Enforces 25% payment at time of booking"
              />
              <Checkbox
                checked={checkboxState}
                onChange={(e) => setCheckboxState(e.target.checked)}
                label="SMS & WhatsApp Appointment Reminders"
                description="Sends automated boarding pass 2 hours prior"
              />
            </div>
          </Card>

          {/* Radio Group & Typography Scale */}
          <Card padding="md" className="space-y-4">
            <Typography variant="h3">Typography Scale & Radios</Typography>
            <div className="space-y-2">
              <Radio
                name="staff-choice"
                checked={radioState === 'option-1'}
                onChange={() => setRadioState('option-1')}
                label="Any Available Senior Specialist"
                description="Fastest slot availability"
              />
              <Radio
                name="staff-choice"
                checked={radioState === 'option-2'}
                onChange={() => setRadioState('option-2')}
                label="Marco Silva (Master Barber & Director)"
                description="₹200 Master Surcharge applies"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1 pt-3 border-t border-slate-200">
              <Typography variant="label">Typography System Proof</Typography>
              <Typography variant="h4">H4 Heading 16px</Typography>
              <Typography variant="body">Body 14px regular</Typography>
              <Typography variant="caption">Caption 12px muted text</Typography>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: OVERLAYS & NAVIGATION */}
      {activeTab === 'overlays' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="md" className="space-y-4">
            <Typography variant="h3">Dialog Modals & Slide-Over Drawers</Typography>
            <p className="text-xs text-slate-500">
              Full keyboard accessibility with ESC listener, focus traps, backdrop blur, and scroll locks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsModalOpen(true)}>Open Test Modal</Button>
              <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>Open Slide-Over Drawer</Button>
              <Button variant="secondary" onClick={() => setShowToast(true)}>Trigger Toast</Button>
            </div>
          </Card>

          <Card padding="md" className="space-y-4">
            <Typography variant="h3">Dropdowns & Tooltips</Typography>
            <div className="flex items-center gap-4">
              <Dropdown
                trigger={<Button variant="outline">Actions Menu <ChevronDown className="w-3.5 h-3.5 ml-1" /></Button>}
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                onClose={() => setIsDropdownOpen(false)}
                items={[
                  { id: '1', label: 'View Profile', onClick: () => {} },
                  { id: '2', label: 'Download Tax Invoice', onClick: () => {} },
                  { id: '3', label: 'Cancel Booking', onClick: () => {}, danger: true }
                ]}
              />

              <Tooltip content="Enforces 25% upfront online slot reservation">
                <span className="p-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold cursor-help flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Advance Policy</span>
                </span>
              </Tooltip>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: DATA DISPLAY & STATES */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card padding="md" className="space-y-2">
              <Typography variant="label">Status Badges</Typography>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="success">Confirmed</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="danger">Cancelled</Badge>
                <Badge variant="brand">25% Advance</Badge>
                <Badge variant="neutral">Completed</Badge>
              </div>
            </Card>

            <Card padding="md" className="space-y-2">
              <Typography variant="label">Specialist Avatars</Typography>
              <div className="flex items-center gap-2">
                <Avatar name="Marco Silva" size="sm" />
                <Avatar name="Priya Sharma" size="md" />
                <Avatar name="David Chen" size="lg" />
              </div>
            </Card>

            <Card padding="md" className="space-y-2">
              <Typography variant="label">Skeleton Loading</Typography>
              <div className="space-y-1.5">
                <Skeleton width="w-3/4" height="h-3" />
                <Skeleton width="w-full" height="h-3" />
                <Skeleton width="w-1/2" height="h-3" />
              </div>
            </Card>
          </div>

          {/* Table Primitive */}
          <Card padding="md" className="space-y-3">
            <Typography variant="h3">Responsive Table Primitive</Typography>
            <Table
              data={[
                { id: '1', code: 'NEX-88219', customer: 'Rahul Kapoor', service: 'Skin Fade', amount: '₹1,000', status: 'Confirmed' },
                { id: '2', code: 'NEX-88220', customer: 'Ananya Deshmukh', service: 'Balayage Color', amount: '₹3,800', status: 'Confirmed' },
                { id: '3', code: 'NEX-88221', customer: 'Vikram Sethi', service: 'Executive Ritual', amount: '₹1,150', status: 'Pending' }
              ]}
              keyExtractor={(item) => item.id}
              columns={[
                { header: 'Booking Code', accessorKey: 'code' },
                { header: 'Customer', accessorKey: 'customer' },
                { header: 'Treatment', accessorKey: 'service' },
                { header: 'Gross Amount', accessorKey: 'amount', align: 'right' },
                {
                  header: 'Status',
                  cell: (item) => (
                    <Badge variant={item.status === 'Confirmed' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  ),
                  align: 'center'
                }
              ]}
            />
            <Pagination currentPage={currentPage} totalPages={4} onPageChange={setCurrentPage} />
          </Card>

          {/* States Demonstration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmptyState
              title="No Upcoming Appointments Found"
              description="Your booking calendar is clean. Explore available treatment slots or rebook your previous specialist."
              actionText="Book New Appointment"
              onAction={() => {}}
            />
            <ErrorState
              title="Slot Reservation Expired"
              message="The 15-minute payment hold on your appointment timed out. Please choose a fresh time slot."
              onRetry={() => {}}
            />
          </div>
        </div>
      )}

      {/* TAB 4: 10 CATEGORY THEMES */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.keys(CATEGORY_THEMES).map((key) => {
              const th = CATEGORY_THEMES[key as CategoryThemeKey];
              const isSelected = selectedThemeKey === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedThemeKey(key as CategoryThemeKey)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-800">{th.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize mt-0.5">{th.tokens.radius} radius</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: th.tokens.primary }} />
                    <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: th.tokens.accent }} />
                    <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: th.tokens.surfaceMuted }} />
                  </div>
                </div>
              );
            })}
          </div>

          <Card padding="md" className="space-y-3">
            <Typography variant="h3">Active Theme Token Inspection ({currentTheme.name})</Typography>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Primary</span>
                <p className="font-mono font-bold text-slate-800 mt-1">{currentTheme.tokens.primary}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Accent</span>
                <p className="font-mono font-bold text-slate-800 mt-1">{currentTheme.tokens.accent}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Headings Font</span>
                <p className="font-medium text-slate-800 mt-1 truncate">{currentTheme.tokens.fontHeading}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Corner Geometry</span>
                <p className="font-bold capitalize text-slate-800 mt-1">{currentTheme.tokens.radius}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Test Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quick Appointment Confirmation"
        description="Verify service duration and advance deposit requirement"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setIsModalOpen(false)}>Confirm Booking</Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p><strong>Selected Specialist:</strong> Marco Silva (Master Barber)</p>
          <p><strong>Service Subtotal:</strong> ₹1,000</p>
          <p className="text-indigo-700 font-bold">Online Advance Due (25%): ₹250</p>
          <p className="text-slate-500">Remaining ₹750 will be settled at venue desk after your session.</p>
        </div>
      </Modal>

      {/* Test Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Salon Appointment Details"
        footer={<Button size="sm" className="w-full" onClick={() => setIsDrawerOpen(false)}>Close Drawer</Button>}
      >
        <div className="space-y-4 text-xs text-slate-700">
          <Alert variant="info" title="Active Booking NEX-88219">
            Client arrival scheduled today at 11:15 AM.
          </Alert>
          <div className="space-y-1">
            <span className="font-bold text-slate-800">Special Instructions:</span>
            <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              Low skin fade, beard oil finish. Client prefers espresso beverage upon arrival.
            </p>
          </div>
        </div>
      </Drawer>

      {/* Test Toast */}
      {showToast && (
        <Toast
          message="Notification: 25% Advance payment verified by gateway."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
