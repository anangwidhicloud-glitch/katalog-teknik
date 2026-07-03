'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Layers3,
  ListFilter,
  PackageOpen,
  PanelLeftOpen,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Tag,
  Wrench,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSheetData } from '../../hooks/useSheetData';
import PageHero from '../components/PageHero';

type ProductRow = {
  No?: string;
  'Nama Produk'?: string;
  'Kategori Utama'?: string;
  'Kategori Kedua'?: string;
  'Sub Kategori'?: string;
  Harga?: string;
  Rating?: string;
  Foto_URL?: string;
  Terlaris?: string;
};

type SubCategoryNode = {
  name: string;
  count: number;
};

type SecondCategoryNode = {
  name: string;
  count: number;
  children: SubCategoryNode[];
};

type MainCategoryNode = {
  name: string;
  count: number;
  children: SecondCategoryNode[];
};

type CategorySidebarProps = {
  tree: MainCategoryNode[];
  totalCount: number;
  selectedMain: string;
  selectedSecond: string;
  selectedSub: string;
  expandedMain: Set<string>;
  expandedSecond: Set<string>;
  onSelectAll: () => void;
  onSelectMain: (name: string) => void;
  onSelectSecond: (main: string, second: string) => void;
  onSelectSub: (main: string, second: string, sub: string) => void;
  onToggleMain: (name: string) => void;
  onToggleSecond: (main: string, second: string) => void;
  onClose?: () => void;
};

const fallbackProducts: ProductRow[] = [
  { No: '1', 'Nama Produk': 'Blue-point BWA 200 Imaging Wheel Alignment', 'Kategori Utama': 'Otomotif', 'Kategori Kedua': 'Wheel', 'Sub Kategori': 'Alignment', Harga: '12000000', Rating: '5', Terlaris: 'True' },
  { No: '2', 'Nama Produk': 'Blue-point Pyramid2 Imaging Wheel Alignment', 'Kategori Utama': 'Otomotif', 'Kategori Kedua': 'Wheel', 'Sub Kategori': 'Alignment', Harga: '6000000', Rating: '5' },
  { No: '3', 'Nama Produk': 'Blue-point Swing-Arm Tire Changer', 'Kategori Utama': 'Otomotif', 'Kategori Kedua': 'Tire', 'Sub Kategori': 'Changer', Harga: '8500000', Rating: '5', Terlaris: 'True' },
  { No: '4', 'Nama Produk': 'Blue-point Two-Post Lift', 'Kategori Utama': 'Hidraulis', 'Kategori Kedua': 'Lift', 'Sub Kategori': '4 Ton', Harga: '25000000', Rating: '4', Terlaris: 'True' },
  { No: '5', 'Nama Produk': 'Blue-point Brake Fluid Changer', 'Kategori Utama': 'Perlengkapan', 'Kategori Kedua': 'Fluid', 'Sub Kategori': 'Brake', Harga: '3000000', Rating: '4' },
  { No: '6', 'Nama Produk': 'Blue-point Hydraulic Jack', 'Kategori Utama': 'Hidraulis', 'Kategori Kedua': 'Jack', 'Sub Kategori': 'Manual', Harga: '8800000', Rating: '5' },
];

function formatCurrency(value?: string) {
  const number = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(number)) return value || 'Hubungi kami';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
}

function isTruthy(value?: string) {
  return ['true', '1', 'yes', 'ya'].includes(String(value ?? '').trim().toLowerCase());
}

function cleanCategory(value?: string, fallback = 'Lainnya') {
  return value?.trim() || fallback;
}

function buildCategoryTree(products: ProductRow[]): MainCategoryNode[] {
  const mainMap = new Map<string, Map<string, Map<string, number>>>();

  products.forEach((product) => {
    const main = cleanCategory(product['Kategori Utama']);
    const second = cleanCategory(product['Kategori Kedua']);
    const sub = cleanCategory(product['Sub Kategori']);

    if (!mainMap.has(main)) mainMap.set(main, new Map());
    const secondMap = mainMap.get(main)!;
    if (!secondMap.has(second)) secondMap.set(second, new Map());
    const subMap = secondMap.get(second)!;
    subMap.set(sub, (subMap.get(sub) ?? 0) + 1);
  });

  return Array.from(mainMap.entries())
    .map(([mainName, secondMap]) => {
      const children = Array.from(secondMap.entries())
        .map(([secondName, subMap]) => {
          const subChildren = Array.from(subMap.entries())
            .map(([subName, count]) => ({ name: subName, count }))
            .sort((a, b) => a.name.localeCompare(b.name, 'id'));

          return {
            name: secondName,
            count: subChildren.reduce((sum, item) => sum + item.count, 0),
            children: subChildren,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'id'));

      return {
        name: mainName,
        count: children.reduce((sum, item) => sum + item.count, 0),
        children,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'id'));
}

function CategorySidebar({
  tree,
  totalCount,
  selectedMain,
  selectedSecond,
  selectedSub,
  expandedMain,
  expandedSecond,
  onSelectAll,
  onSelectMain,
  onSelectSecond,
  onSelectSub,
  onToggleMain,
  onToggleSecond,
  onClose,
}: CategorySidebarProps) {
  const allSelected = selectedMain === 'Semua';

  return (
    <div className="category-panel-inner">
      <div className="category-panel-head">
        <div className="category-panel-icon">
          <FolderTree size={20} />
        </div>
        <div>
          <span className="category-panel-kicker">3 tingkat navigasi</span>
          <h2>Jelajahi Kategori</h2>
        </div>
        {onClose && (
          <button type="button" className="category-panel-close" onClick={onClose} aria-label="Tutup kategori">
            <X size={18} />
          </button>
        )}
      </div>

      <button
        type="button"
        className={`category-all-button ${allSelected ? 'is-active' : ''}`}
        onClick={() => {
          onSelectAll();
          onClose?.();
        }}
      >
        <span className="category-node-icon"><Boxes size={17} /></span>
        <span className="category-node-copy">
          <strong>Semua Produk</strong>
          <small>Katalog lengkap</small>
        </span>
        <span className="category-count">{totalCount}</span>
        {allSelected && <Check size={15} className="category-check" />}
      </button>

      <div className="category-tree" role="tree" aria-label="Kategori produk bertingkat">
        {tree.map((mainNode, mainIndex) => {
          const mainActive = selectedMain === mainNode.name;
          const mainOpen = expandedMain.has(mainNode.name);

          return (
            <motion.div
              key={mainNode.name}
              className="category-main-group"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: mainIndex * 0.045, duration: 0.32 }}
              role="treeitem"
              aria-expanded={mainOpen}
              aria-selected={mainActive}
            >
              <div className={`category-main-row ${mainActive ? 'is-active' : ''}`}>
                <button
                  type="button"
                  className="category-main-select"
                  onClick={() => onSelectMain(mainNode.name)}
                >
                  <span className="category-node-icon"><Layers3 size={17} /></span>
                  <span className="category-node-copy">
                    <strong>{mainNode.name}</strong>
                    <small>Kategori utama</small>
                  </span>
                  <span className="category-count">{mainNode.count}</span>
                </button>
                <button
                  type="button"
                  className="category-expand-button"
                  onClick={() => onToggleMain(mainNode.name)}
                  aria-label={`${mainOpen ? 'Tutup' : 'Buka'} kategori ${mainNode.name}`}
                >
                  <motion.span animate={{ rotate: mainOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={16} />
                  </motion.span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {mainOpen && (
                  <motion.div
                    className="category-second-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {mainNode.children.map((secondNode) => {
                      const secondKey = `${mainNode.name}::${secondNode.name}`;
                      const secondActive = mainActive && selectedSecond === secondNode.name;
                      const secondOpen = expandedSecond.has(secondKey);

                      return (
                        <div key={secondKey} className="category-second-group" role="treeitem" aria-expanded={secondOpen} aria-selected={secondActive}>
                          <div className={`category-second-row ${secondActive ? 'is-active' : ''}`}>
                            <button
                              type="button"
                              className="category-second-select"
                              onClick={() => onSelectSecond(mainNode.name, secondNode.name)}
                            >
                              <span className="category-node-dot" />
                              <span className="category-node-copy">
                                <strong>{secondNode.name}</strong>
                                <small>Kategori kedua</small>
                              </span>
                              <span className="category-count">{secondNode.count}</span>
                            </button>
                            <button
                              type="button"
                              className="category-expand-button category-expand-small"
                              onClick={() => onToggleSecond(mainNode.name, secondNode.name)}
                              aria-label={`${secondOpen ? 'Tutup' : 'Buka'} kategori ${secondNode.name}`}
                            >
                              <motion.span animate={{ rotate: secondOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronRight size={14} />
                              </motion.span>
                            </button>
                          </div>

                          <AnimatePresence initial={false}>
                            {secondOpen && (
                              <motion.div
                                className="category-sub-list"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.24 }}
                              >
                                {secondNode.children.map((subNode) => {
                                  const subActive = secondActive && selectedSub === subNode.name;
                                  return (
                                    <button
                                      type="button"
                                      key={`${secondKey}::${subNode.name}`}
                                      className={`category-sub-button ${subActive ? 'is-active' : ''}`}
                                      onClick={() => {
                                        onSelectSub(mainNode.name, secondNode.name, subNode.name);
                                        onClose?.();
                                      }}
                                    >
                                      <Tag size={13} />
                                      <span>{subNode.name}</span>
                                      <span className="category-count">{subNode.count}</span>
                                      {subActive && <Check size={13} />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="category-panel-foot">
        <Sparkles size={15} />
        <span>Pilih hingga subkategori untuk hasil yang lebih presisi.</span>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { data, loading, error } = useSheetData();
  const products = (data as ProductRow[]).length > 0 ? (data as ProductRow[]) : fallbackProducts;
  const [search, setSearch] = useState('');
  const [selectedMain, setSelectedMain] = useState('Semua');
  const [selectedSecond, setSelectedSecond] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [expandedMain, setExpandedMain] = useState<Set<string>>(new Set());
  const [expandedSecond, setExpandedSecond] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<ProductRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const categoryTree = useMemo(() => buildCategoryTree(products), [products]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const main = cleanCategory(product['Kategori Utama']);
      const second = cleanCategory(product['Kategori Kedua']);
      const sub = cleanCategory(product['Sub Kategori']);
      const mainMatch = selectedMain === 'Semua' || main === selectedMain;
      const secondMatch = !selectedSecond || second === selectedSecond;
      const subMatch = !selectedSub || sub === selectedSub;
      const searchable = [
        product['Nama Produk'],
        main,
        second,
        sub,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return mainMatch && secondMatch && subMatch && (!keyword || searchable.includes(keyword));
    });
  }, [products, search, selectedMain, selectedSecond, selectedSub]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSize, safeCurrentPage]);

  const visiblePageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(safeCurrentPage - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  }, [safeCurrentPage, totalPages]);

  const activePath = [
    selectedMain === 'Semua' ? 'Semua Produk' : selectedMain,
    selectedSecond,
    selectedSub,
  ].filter(Boolean);

  const selectAll = () => {
    setCurrentPage(1);
    setSelectedMain('Semua');
    setSelectedSecond('');
    setSelectedSub('');
  };

  const selectMain = (name: string) => {
    setCurrentPage(1);
    setSelectedMain(name);
    setSelectedSecond('');
    setSelectedSub('');
    setExpandedMain((current) => new Set(current).add(name));
  };

  const selectSecond = (main: string, second: string) => {
    setCurrentPage(1);
    setSelectedMain(main);
    setSelectedSecond(second);
    setSelectedSub('');
    setExpandedMain((current) => new Set(current).add(main));
    setExpandedSecond((current) => new Set(current).add(`${main}::${second}`));
  };

  const selectSub = (main: string, second: string, sub: string) => {
    setCurrentPage(1);
    setSelectedMain(main);
    setSelectedSecond(second);
    setSelectedSub(sub);
    setExpandedMain((current) => new Set(current).add(main));
    setExpandedSecond((current) => new Set(current).add(`${main}::${second}`));
  };

  const toggleMain = (name: string) => {
    setExpandedMain((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleSecond = (main: string, second: string) => {
    const key = `${main}::${second}`;
    setExpandedSecond((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const resetFilters = () => {
    setSearch('');
    selectAll();
  };

  const sidebarProps: CategorySidebarProps = {
    tree: categoryTree,
    totalCount: products.length,
    selectedMain,
    selectedSecond,
    selectedSub,
    expandedMain,
    expandedSecond,
    onSelectAll: selectAll,
    onSelectMain: selectMain,
    onSelectSecond: selectSecond,
    onSelectSub: selectSub,
    onToggleMain: toggleMain,
    onToggleSecond: toggleSecond,
  };

  return (
    <main>
      <PageHero
        eyebrow="Katalog produk"
        title={<>Peralatan yang siap <span className="gradient-text">bekerja keras.</span></>}
        description="Telusuri produk melalui struktur kategori tiga tingkat yang mengikuti database: kategori utama, kategori kedua, hingga subkategori paling spesifik."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="site-chip"><Boxes size={14} /> {products.length} produk tersedia</span>
          <span className="site-chip"><Layers3 size={14} /> {categoryTree.length} kategori utama</span>
          <span className="site-chip"><Star size={14} /> {products.filter((item) => isTruthy(item.Terlaris)).length} produk terlaris</span>
        </div>
      </PageHero>

      <section className="section-shell pb-28">
        <div className="product-catalog-layout">
          <aside className="product-category-sidebar site-card" data-aos="fade-right" data-aos-duration="720">
            <CategorySidebar {...sidebarProps} />
          </aside>

          <div className="product-catalog-content">
            <div className="product-page-toolbar" data-aos="fade-up">
              <button
                type="button"
                className="product-mobile-filter-trigger"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <PanelLeftOpen size={18} />
                Kategori
              </button>

              <div className="product-search">
                <Search size={18} />
                <input
                  type="search"
                  className="site-input"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari nama, kategori, atau tipe produk..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setCurrentPage(1); }}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div className="product-toolbar-actions">
                <label className="product-page-size">
                  <span>Tampilkan</span>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                    aria-label="Jumlah produk per halaman"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </label>
                <div className="result-count"><ListFilter size={14} /> {filtered.length} hasil</div>
              </div>
            </div>

            <div className="product-active-path" data-aos="fade-up" data-aos-delay="80">
              <div className="product-active-path-copy">
                <span className="product-active-label">Pilihan aktif</span>
                <div className="product-breadcrumbs">
                  {activePath.map((item, index) => (
                    <span key={`${item}-${index}`}>
                      {index > 0 && <ChevronRight size={13} />}
                      <strong>{item}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {(selectedMain !== 'Semua' || search) && (
                <button type="button" className="product-reset-button" onClick={resetFilters}>
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>

            {error && (
              <div className="site-card mb-5 border-[var(--danger)]/20 p-4 text-sm text-[var(--danger)]">
                Data online belum dapat dimuat. Katalog contoh tetap ditampilkan.
              </div>
            )}

            {loading && data.length === 0 ? (
              <div className="product-grid product-catalog-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="site-card min-h-[430px] animate-pulse bg-[var(--surface-soft)]" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="site-card empty-state" data-aos="zoom-in">
                <div className="empty-state-icon"><PackageOpen size={27} /></div>
                <h2 className="text-xl font-bold">Produk tidak ditemukan</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                  Tidak ada produk pada kombinasi kategori atau kata kunci tersebut. Coba pilih tingkat kategori lain.
                </p>
                <button type="button" className="site-button site-button-secondary mt-5" onClick={resetFilters}>
                  <RotateCcw size={16} /> Reset filter
                </button>
              </div>
            ) : (
              <motion.div layout className="product-grid product-catalog-grid">
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product, index) => (
                    <motion.article
                      layout
                      key={`${product.No ?? index}-${product['Nama Produk'] ?? 'produk'}`}
                      initial={{ opacity: 0, scale: 0.94, y: 24 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 14 }}
                      transition={{ duration: 0.42, delay: Math.min(index * 0.045, 0.24), ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -9 }}
                      className="site-card product-card product-catalog-card"
                    >
                      <div className="product-card-ambient" />
                      <div className="product-image-wrap">
                        <div className="product-card-badges">
                          {isTruthy(product.Terlaris) && <span className="site-chip product-badge product-best-badge">Terlaris</span>}
                          <span className="site-chip product-badge product-main-badge">{cleanCategory(product['Kategori Utama'])}</span>
                        </div>
                        {product.Foto_URL ? (
                          <Image
                            src={product.Foto_URL}
                            alt={product['Nama Produk'] || 'Produk teknik'}
                            fill
                            sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 34vw"
                            className="product-image"
                          />
                        ) : (
                          <div className="product-image-placeholder"><Wrench size={48} strokeWidth={1.2} /></div>
                        )}
                        <span className="product-image-scan" aria-hidden="true" />
                      </div>

                      <div className="product-card-content">
                        <div className="product-category-trail">
                          <span>{cleanCategory(product['Kategori Utama'])}</span>
                          <ChevronRight size={11} />
                          <span>{cleanCategory(product['Kategori Kedua'])}</span>
                          <ChevronRight size={11} />
                          <span>{cleanCategory(product['Sub Kategori'])}</span>
                        </div>
                        <h2 className="product-card-title">{product['Nama Produk'] || 'Produk Teknik Profesional'}</h2>
                        <div className="product-card-meta">
                          <span>Professional equipment</span>
                          <span className="inline-flex items-center gap-1 text-amber-500"><Star size={13} fill="currentColor" /> {product.Rating || '5'}</span>
                        </div>
                        <div className="product-price">{formatCurrency(product.Harga)}</div>
                        <div className="product-card-actions">
                          <button type="button" className="site-button site-button-secondary" onClick={() => setSelected(product)}>
                            Detail
                          </button>
                          <Link href="/contact" className="site-button site-button-primary">Penawaran</Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filtered.length > 0 && totalPages > 1 && (
              <nav className="product-pagination" aria-label="Navigasi halaman produk" data-aos="fade-up">
                <button
                  type="button"
                  className="product-page-button product-page-arrow"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>

                {visiblePageNumbers[0] > 1 && (
                  <>
                    <button type="button" className="product-page-button" onClick={() => setCurrentPage(1)}>1</button>
                    {visiblePageNumbers[0] > 2 && <span className="product-page-ellipsis">…</span>}
                  </>
                )}

                {visiblePageNumbers.map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`product-page-button ${safeCurrentPage === page ? 'is-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={safeCurrentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                {visiblePageNumbers.at(-1)! < totalPages && (
                  <>
                    {visiblePageNumbers.at(-1)! < totalPages - 1 && <span className="product-page-ellipsis">…</span>}
                    <button type="button" className="product-page-button" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                  </>
                )}

                <button
                  type="button"
                  className="product-page-button product-page-arrow"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={16} />
                </button>

                <span className="product-page-summary">
                  {(safeCurrentPage - 1) * pageSize + 1}–{Math.min(safeCurrentPage * pageSize, filtered.length)} dari {filtered.length}
                </span>
              </nav>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="category-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setMobileFiltersOpen(false);
            }}
          >
            <motion.aside
              className="category-mobile-drawer"
              initial={{ x: '-102%' }}
              animate={{ x: 0 }}
              exit={{ x: '-102%' }}
              transition={{ type: 'spring', stiffness: 310, damping: 32 }}
            >
              <CategorySidebar {...sidebarProps} onClose={() => setMobileFiltersOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setSelected(null);
            }}
          >
            <motion.div
              className="product-modal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Tutup detail">
                <X size={19} />
              </button>
              <div className="product-modal-image">
                {selected.Foto_URL ? (
                  <Image
                    src={selected.Foto_URL}
                    alt={selected['Nama Produk'] || 'Produk'}
                    fill
                    sizes="(max-width: 760px) 100vw, 45vw"
                    className="object-contain p-10"
                  />
                ) : (
                  <div className="product-image-placeholder"><Wrench size={70} strokeWidth={1} /></div>
                )}
              </div>
              <div className="product-modal-content">
                <span className="site-chip">{selected['Kategori Utama'] || 'Peralatan'}</span>
                <h2 className="mt-6 text-3xl font-black tracking-[-0.04em]">{selected['Nama Produk']}</h2>
                <p className="mt-4 leading-7 text-[var(--text-secondary)]">
                  Produk kategori {selected['Kategori Kedua'] || selected['Kategori Utama']} dengan spesifikasi {selected['Sub Kategori'] || 'profesional'}, dirancang untuk mendukung operasional workshop secara efisien.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="site-card p-4">
                    <span className="text-xs text-[var(--text-muted)]">Rating</span>
                    <strong className="mt-2 flex items-center gap-2 text-lg"><Star size={16} fill="currentColor" className="text-amber-500" /> {selected.Rating || '5'}</strong>
                  </div>
                  <div className="site-card p-4">
                    <span className="text-xs text-[var(--text-muted)]">Harga</span>
                    <strong className="mt-2 block text-lg">{formatCurrency(selected.Harga)}</strong>
                  </div>
                </div>
                <Link href="/contact" className="site-button site-button-primary mt-7 w-full">
                  Minta Penawaran <ArrowRight size={17} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
