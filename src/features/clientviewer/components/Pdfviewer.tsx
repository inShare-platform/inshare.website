import React from "react";
import { Viewer, Worker, type RenderPageProps } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin, type FlagKeyword } from '@react-pdf-viewer/search';
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";


export default function PdfViewer() {
  const [currentKeyword, setCurrentKeyword] = React.useState<FlagKeyword>({
    keyword: '',
    matchCase: false,
    wholeWords: false,
  });
  const [currentPage, setCurrentPage] = React.useState(0);
  const [numPages, setNumPages] = React.useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(false);
  const [matchCount, setMatchCount] = React.useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = React.useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  // Analytics tracking
  const mountTimeRef = React.useRef<number>(Date.now());
  const searchHistoryRef = React.useRef<Array<{ text: string; isPresent: boolean }>>([]);
  
  const pageNavigationPluginInstance = pageNavigationPlugin();
  
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Thumbnails } = thumbnailPluginInstance;
  
  const zoomPluginInstance = zoomPlugin();
  
  const searchPluginInstance = searchPlugin();
  const { highlight, jumpToNextMatch, jumpToPreviousMatch } = searchPluginInstance;

  // Mount logging
  React.useEffect(() => {
    console.log('PDF Viewer mounted - Starting analytics tracking');
  }, []);

  // Keyboard shortcut handler for Ctrl+F / Cmd+F
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+F (Windows/Linux) or Cmd+F (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault(); // Prevent default browser search
        searchInputRef.current?.focus(); // Focus custom search bar
        searchInputRef.current?.select(); // Select any existing text
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search effect with search history tracking
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentKeyword.keyword.trim()) {
        highlight([
          {
            keyword: currentKeyword.keyword,
            matchCase: currentKeyword.matchCase,
          }
        ]);
        
        // Track search in history
        // Note: We'll update isPresent when we get matchCount
        const existingSearchIndex = searchHistoryRef.current.findIndex(
          s => s.text.toLowerCase() === currentKeyword.keyword.toLowerCase()
        );
        
        if (existingSearchIndex === -1) {
          searchHistoryRef.current.push({
            text: currentKeyword.keyword,
            isPresent: false // Will be updated when we have match count
          });
        }
      } else {
        // Clear highlights when search is empty
        highlight([]);
        setMatchCount(0);
        setCurrentMatchIndex(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentKeyword.keyword, currentKeyword.matchCase, highlight]);

  // Update search history when match count changes
  React.useEffect(() => {
    if (currentKeyword.keyword.trim() && matchCount >= 0) {
      const searchIndex = searchHistoryRef.current.findIndex(
        s => s.text.toLowerCase() === currentKeyword.keyword.toLowerCase()
      );
      
      if (searchIndex !== -1) {
        searchHistoryRef.current[searchIndex].isPresent = matchCount > 0;
      }
    }
  }, [matchCount, currentKeyword.keyword]);

  // Analytics logging on unmount
  React.useEffect(() => {
    return () => {
      const spentTime = Math.floor((Date.now() - mountTimeRef.current) / 1000); // in seconds
      
      const analyticsData = {
        spent_time: spentTime,
        search: searchHistoryRef.current
      };
      
      console.log('PDF Viewer Analytics:', analyticsData);
      
      // TODO: Send to analytics API
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analyticsData)
      // });
    };
  }, []);

  const handleNextMatch = () => {
    if (matchCount > 0) {
      jumpToNextMatch();
      setCurrentMatchIndex((prev) => (prev < matchCount ? prev + 1 : 1));
    }
  };

  const handlePreviousMatch = () => {
    if (matchCount > 0) {
      jumpToPreviousMatch();
      setCurrentMatchIndex((prev) => (prev > 1 ? prev - 1 : matchCount));
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentKeyword.keyword.trim()) {
      highlight([
        {
          keyword: currentKeyword.keyword,
          matchCase: currentKeyword.matchCase,
        }
      ]);
    }
  };

  const handleDocumentLoad = (e: any) => {
    setNumPages(e.doc.numPages);
  };

  const handlePageChange = (e: any) => {
    setCurrentPage(e.currentPage);
  };

  return (
    <div className="flex h-screen w-full flex-col" style={{ backgroundColor: '#f6f7f8' }}>
      {/* Sticky Header */}
      <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 z-30 sticky top-0 shadow-sm" 
        style={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #e5e7eb'
        }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(19, 127, 236, 0.1)';
              e.currentTarget.style.color = '#137fec';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <MenuIcon />
          </button>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: '#1f2937' }}>DocuView</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Bar with Navigation */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <div className="flex items-center relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="h-8 w-40 rounded-md pl-8 pr-2 text-sm"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#1f2937'
                }}
                value={currentKeyword.keyword}
                onChange={(e) => setCurrentKeyword({ ...currentKeyword, keyword: e.target.value })}
                onKeyPress={handleSearch}
              />
              <SearchIcon 
                fontSize="small" 
                className="absolute left-2"
                style={{ color: '#9ca3af', fontSize: '18px' }}
              />
            </div>
            
            {matchCount > 0 && (
              <>
                <div className="flex items-center text-xs font-medium px-2" style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {currentMatchIndex}/{matchCount}
                </div>
                <button
                  onClick={handlePreviousMatch}
                  className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                    e.currentTarget.style.color = '#137fec';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}>
                  <ArrowBackIcon sx={{ fontSize: 16 }} />
                </button>
                <button
                  onClick={handleNextMatch}
                  className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                    e.currentTarget.style.color = '#137fec';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </button>
              </>
            )}
          </div>
          
          {/* Download Icon */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
            style={{ 
              backgroundColor: '#137fec',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0e63c4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#137fec';
            }}>
            <DownloadIcon fontSize="small" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Drawer */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed z-20
          w-72 h-[calc(100vh-4rem)]
          flex flex-col p-3 shrink-0 
          transition-transform duration-300 ease-in-out
          shadow-xl
        `}
        style={{
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #e5e7eb'
        }}>
          <div className="mb-3 pb-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
              Pages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-1">
            {/* Thumbnails from react-pdf-viewer */}
            <div className="rpv-thumbnail-custom-layout">
              <Thumbnails />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main 
          className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}`}
          style={{ backgroundColor: '#f6f7f8' }}>
          <div className="flex h-full items-center justify-center transition-all duration-300 ease-in-out">
            {/* PDF Viewer Area */}
            <div className="w-full h-full max-w-5xl rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
              style={{ backgroundColor: '#FFFFFF' }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="h-full">
                  <Viewer
                    fileUrl="/angular_mastery_roadmap.pdf"
                    plugins={[
                      pageNavigationPluginInstance,
                      thumbnailPluginInstance,
                      zoomPluginInstance,
                      searchPluginInstance
                    ]}
                    onDocumentLoad={handleDocumentLoad}
                    onPageChange={handlePageChange}
                  />
                </div>
              </Worker>
            </div>
          </div>
        </main>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: '#137fec' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0e63c4'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#137fec'}>
          <SupportAgentIcon sx={{ fontSize: 28 }} />
        </button>
      </div>

      <style>{`
        .rpv-thumbnail-custom-layout .rpv-thumbnail__list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        
        .rpv-thumbnail-custom-layout .rpv-thumbnail__list-item {
          position: relative;
          cursor: pointer;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 220px;
          overflow: visible;
          background: #f9fafb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        .rpv-thumbnail-custom-layout .rpv-thumbnail__list-item:hover {
          transform: scale(1.03);
          z-index: 10;
          border-color: #137fec;
          box-shadow: 0 4px 12px 0 rgba(19, 127, 236, 0.15);
        }
        
        .rpv-thumbnail-custom-layout .rpv-thumbnail__list-item--selected {
          border-color: #137fec;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(19, 127, 236, 0.1), 0 4px 12px 0 rgba(19, 127, 236, 0.2);
        }
        
        .rpv-thumbnail-custom-layout .rpv-thumbnail__container {
          width: 100%;
          height: 100%;
          min-height: 220px;
          border-radius: 0.375rem;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .rpv-thumbnail-custom-layout .rpv-thumbnail__container canvas {
          width: 100% !important;
          height: auto !important;
          display: block;
        }
        
        .rpv-thumbnail-custom-layout .rpv-thumbnail__label {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          background: rgba(19, 127, 236, 0.9);
          border-radius: 0.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
