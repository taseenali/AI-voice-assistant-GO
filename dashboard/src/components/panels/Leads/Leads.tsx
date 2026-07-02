import { useState, useEffect } from 'react';
import { useLeads } from '../../../hooks/useLeads';
import { useConfig } from '../../../hooks/useConfig';
import { FilterBar } from './FilterBar';
import { LeadsTable } from './LeadsTable';
import { LeadDetailPanel } from './LeadDetailPanel';
import { EmptyState } from '../../shared/EmptyState';
import { PageHeader } from '../../layout/PageHeader';
import { LoadingState } from '../../shared/LoadingState';
import { UserSearch } from 'lucide-react';
import type { Lead } from '../../../types/lead';

export function Leads() {
  const { leads, total, hasMore, loading, loadingMore, loadMore } = useLeads();
  const { config } = useConfig();
  const [serviceFilter, setServiceFilter] = useState('');
  const [completenessFilter, setCompletenessFilter] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Push a history entry when panel opens so browser Back closes it
  useEffect(() => {
    if (!selectedLead) return;
    window.history.pushState({ panel: 'lead' }, '');
    function onPop() { setSelectedLead(null); }
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [selectedLead?.capturedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const services = config?.services?.map(s => s.display_name) || [];

  let filteredLeads = leads;
  if (serviceFilter) {
    filteredLeads = filteredLeads.filter(l => l.service === serviceFilter);
  }
  if (completenessFilter > 0) {
    filteredLeads = filteredLeads.filter(l => l.completeness >= completenessFilter);
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Leads" subtitle="Loading leads..." />
        <LoadingState variant="panel" />
      </div>
    );
  }

  if (!loading && leads.length === 0) {
    return (
      <div>
        <PageHeader title="Leads" subtitle="Captured lead profiles" />
        <EmptyState
          icon={UserSearch}
          title="No leads captured yet"
          description="Lead profiles are generated during voice calls when the AI identifies a prospective patient."
          variant="info"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={total > leads.length ? `${total} leads · showing ${leads.length}` : `${leads.length} lead${leads.length !== 1 ? 's' : ''} captured`}
      />
      <FilterBar
        serviceFilter={serviceFilter}
        completenessFilter={completenessFilter}
        onServiceChange={setServiceFilter}
        onCompletenessChange={setCompletenessFilter}
        services={services}
      />
      <LeadsTable
        leads={filteredLeads}
        onLeadClick={setSelectedLead}
      />
      {hasMore && (
        <div className="px-5 py-3 border-t border-card-border">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
      <LeadDetailPanel
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}