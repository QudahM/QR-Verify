import React, { useState, useEffect } from 'react';
import { QrCode, Download, Trash2, Calendar, Link, Type, Search, Filter, Grid, List, BarChart3, Eye, RefreshCw, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { subscribeToQRCodeUpdates } from '../../lib/qrTracker';
import QRAnalytics from '../analytics/QRAnalytics';

interface QRCodeRecord {
  id: string;
  content: string;
  type: 'text' | 'url';
  qr_data_url: string;
  created_at: string;
  tracking_url?: string;
  scan_count: number;
  last_scanned_at?: string;
  is_tracked?: boolean;
  original_qr_id?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'url'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedQR, setSelectedQR] = useState<QRCodeRecord | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQRCodes();
      setupRealTimeSubscription();
    }
  }, [user]);

  const setupRealTimeSubscription = () => {
    if (!user) return;

    console.log('Setting up real-time subscription for dashboard');
    
    const subscription = subscribeToQRCodeUpdates(user.id, (payload) => {
      console.log('Dashboard received QR code update:', payload);
      
      // Update the specific QR code in our state
      setQrCodes(prev => 
        prev.map(qr => 
          qr.id === payload.new.id 
            ? { 
                ...qr, 
                scan_count: payload.new.scan_count, 
                last_scanned_at: payload.new.last_scanned_at 
              }
            : qr
        )
      );
    });

    return () => {
      console.log('Cleaning up dashboard subscription');
      subscription.unsubscribe();
    };
  };

  const fetchQRCodes = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      console.log('Fetching QR codes for user:', user?.id);
      
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching QR codes:', error);
        throw error;
      }

      console.log('Fetched QR codes:', data);
      setQrCodes(data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      console.log('Deleting QR code:', id);
      
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setQrCodes(qrCodes.filter(qr => qr.id !== id));

      // Close analytics if the deleted QR was selected
      if (selectedQR?.id === id) {
        setSelectedQR(null);
        setShowAnalytics(false);
      }
      
      console.log('QR code deleted successfully');
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const downloadQRCode = (qrCode: QRCodeRecord) => {
    const link = document.createElement('a');
    link.download = `qr-${qrCode.type}-${Date.now()}.png`;
    link.href = qrCode.qr_data_url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewAnalytics = (qrCode: QRCodeRecord) => {
    setSelectedQR(qrCode);
    setShowAnalytics(true);
  };

  const openTrackingUrl = (qrCode: QRCodeRecord) => {
    if (qrCode.tracking_url) {
      window.open(qrCode.tracking_url, '_blank');
    }
  };

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || qr.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastScanned = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTotalScans = () => {
    return qrCodes.reduce((sum, qr) => sum + qr.scan_count, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your QR codes...</p>
        </div>
      </div>
    );
  }

  if (showAnalytics && selectedQR) {
    return (
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => setShowAnalytics(false)}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        {/* QR Code Header */}
        <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-6 shadow-glass">
          <div className="flex items-center space-x-6">
            <div className="bg-white p-4 rounded-xl shadow-glass-sm">
              <img
                src={selectedQR.qr_data_url}
                alt="QR Code"
                className="w-20 h-20 object-contain rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {selectedQR.type === 'url' ? (
                  <Link className="w-5 h-5 text-info" strokeWidth={1.5} />
                ) : (
                  <Type className="w-5 h-5 text-primary" strokeWidth={1.5} />
                )}
                <span className="text-sm font-medium text-foreground capitalize">{selectedQR.type}</span>
                {selectedQR.tracking_url && (
                  <button
                    onClick={() => openTrackingUrl(selectedQR)}
                    className="flex items-center space-x-1 px-2 py-1 bg-info/10 hover:bg-info/20 rounded-lg border border-info/20 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-info" strokeWidth={1.5} />
                    <span className="text-xs text-info">Test Tracking</span>
                  </button>
                )}
              </div>
              <p className="text-foreground font-medium mb-1 break-all">{selectedQR.content}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Created: {formatDate(selectedQR.created_at)}</span>
                <span>•</span>
                <span>Last scanned: {formatLastScanned(selectedQR.last_scanned_at)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">{selectedQR.scan_count}</div>
              <div className="text-sm text-muted-foreground">Total Scans</div>
            </div>
          </div>
        </div>

        {/* Analytics with detailed tracking information */}
        <QRAnalytics 
          qrCodeId={selectedQR.id} 
          qrCodeContent={selectedQR.content}
          qrCodeData={selectedQR}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
          Your QR Codes
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Manage your QR codes and track their performance with real-time analytics
        </p>
      </div>

      {/* Controls */}
      <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-6 shadow-glass animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder-muted-foreground transition-all duration-200"
            />
          </div>
          
          {/* Filter and View Controls */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={() => fetchQRCodes(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-3 py-2 bg-surface hover:bg-surface-hover disabled:bg-surface/50 rounded-xl border border-border transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
              <span className="text-sm">Refresh</span>
            </button>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'text' | 'url')}
                className="pl-10 pr-8 py-2 bg-input border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="text">Text Only</option>
                <option value="url">URLs Only</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex bg-surface rounded-xl border border-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white shadow-glow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                <Grid className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white shadow-glow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                <List className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filteredQRCodes.length} of {qrCodes.length} QR codes
            </span>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>{qrCodes.filter(qr => qr.type === 'url').length} URLs</span>
              <span>{qrCodes.filter(qr => qr.type === 'text').length} Text</span>
              <span>{getTotalScans()} Total Scans</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Codes Grid/List */}
      {filteredQRCodes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-surface rounded-2xl mx-auto flex items-center justify-center border border-border mb-6">
            <QrCode className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || filterType !== 'all' ? 'No matching QR codes' : 'No QR codes yet'}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Create your first QR code to get started'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredQRCodes.map((qrCode) => (
            <div
              key={qrCode.id}
              className={`glass bg-glass-bg/50 border border-glass-border rounded-2xl shadow-glass hover:bg-glass-bg/70 transition-all duration-300 hover:scale-105 ${
                viewMode === 'list' ? 'p-6' : 'p-6'
              }`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <div className="space-y-4">
                  {/* QR Code Image */}
                  <div className="relative group">
                    <div className="bg-white p-4 rounded-xl shadow-glass-sm">
                      <img
                        src={qrCode.qr_data_url}
                        alt="QR Code"
                        className="w-full h-32 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {qrCode.type === 'url' ? (
                          <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                            <Link className="w-4 h-4 text-info" strokeWidth={1.5} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Type className="w-4 h-4 text-primary" strokeWidth={1.5} />
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground capitalize">{qrCode.type}</span>
                      </div>
                      
                      {/* Scan Count Badge */}
                      <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 rounded-full border border-success/20">
                        <Eye className="w-3 h-3 text-success" strokeWidth={1.5} />
                        <span className="text-xs text-success font-medium">{qrCode.scan_count}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm break-all line-clamp-2">
                      {qrCode.content}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" strokeWidth={1.5} />
                        <span>{formatDate(qrCode.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" strokeWidth={1.5} />
                        <span>Last scan: {formatLastScanned(qrCode.last_scanned_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t border-border">
                    <button
                      onClick={() => viewAnalytics(qrCode)}
                      className="flex-1 bg-info hover:bg-info/90 text-white py-2 px-4 rounded-xl font-medium hover:shadow-glow transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                      <span>Analytics</span>
                    </button>
                    <button
                      onClick={() => downloadQRCode(qrCode)}
                      className="bg-success hover:bg-success/90 text-white p-2 rounded-xl transition-all duration-200"
                    >
                      <Download className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => deleteQRCode(qrCode.id)}
                      className="bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded-xl transition-all duration-200 border border-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex items-center space-x-6">
                  <div className="bg-white p-4 rounded-xl shadow-glass-sm">
                    <img
                      src={qrCode.qr_data_url}
                      alt="QR Code"
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      {qrCode.type === 'url' ? (
                        <Link className="w-4 h-4 text-info" strokeWidth={1.5} />
                      ) : (
                        <Type className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      )}
                      <span className="text-sm font-medium text-foreground capitalize">{qrCode.type}</span>
                      {qrCode.tracking_url && (
                        <button
                          onClick={() => openTrackingUrl(qrCode)}
                          className="flex items-center space-x-1 px-2 py-1 bg-info/10 hover:bg-info/20 rounded-lg border border-info/20 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-info" strokeWidth={1.5} />
                          <span className="text-xs text-info">Test</span>
                        </button>
                      )}
                    </div>
                    <p className="text-foreground font-medium break-all">{qrCode.content}</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>Created: {formatDate(qrCode.created_at)}</span>
                      <span>•</span>
                      <span>Last scan: {formatLastScanned(qrCode.last_scanned_at)}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-foreground">{qrCode.scan_count}</div>
                    <div className="text-xs text-muted-foreground">Scans</div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => viewAnalytics(qrCode)}
                      className="bg-info hover:bg-info/90 text-white py-2 px-4 rounded-xl font-medium hover:shadow-glow transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                      <span>Analytics</span>
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadQRCode(qrCode)}
                        className="bg-success hover:bg-success/90 text-white p-2 rounded-xl transition-all duration-200"
                      >
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => deleteQRCode(qrCode.id)}
                        className="bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded-xl transition-all duration-200 border border-destructive/20"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;