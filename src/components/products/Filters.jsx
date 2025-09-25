import React from 'react';
import Dropdown from '../ui/Dropdown.jsx';
import { Filters as FiltersIcon, ChevronDown } from '../ui';

export default function Filters({
  filterOpen,
  setFilterOpen,
  sortOpen,
  setSortOpen,
  priceFromInput,
  priceToInput,
  onFromChange,
  onToChange,
  onApply,
  isInvalid,
  errorText,
  sortLabel,
  onSortSelect,
}) {
  return (
    <div className="toolbar">
      {(filterOpen || sortOpen) ? (<div className="menu-backdrop" onClick={() => { setFilterOpen(false); setSortOpen(false); }} />) : null}
      <div className="menu">
        <Dropdown open={filterOpen} onOpenChange={(v) => { setFilterOpen(v); if (v) setSortOpen(false); }}>
          <Dropdown.Trigger>
            <img className='filters-icon-menu' src={FiltersIcon} alt="Filters" />
            <span>Filter</span>
          </Dropdown.Trigger>
          <Dropdown.Panel>
            <h4>Select price</h4>
            <div className="row long-panel">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="From *"
                value={priceFromInput}
                onChange={onFromChange}
                onKeyDown={(e) => { if (["e","E","+","-","."].includes(e.key)) e.preventDefault(); }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="To *"
                value={priceToInput}
                onChange={onToChange}
                onKeyDown={(e) => { if (["e","E","+","-","."].includes(e.key)) e.preventDefault(); }}
              />
            </div>
            {isInvalid ? <p className="error-text" style={{ marginTop: 4 }}>From must be less than or equal to To</p> : null}
            <button
              className="btn btn-primary"
              onClick={onApply}
              disabled={isInvalid}
            >
              Apply
            </button>
          </Dropdown.Panel>
        </Dropdown>
      </div>

      <div className="menu">
        <Dropdown open={sortOpen} onOpenChange={(v) => { setSortOpen(v); if (v) setFilterOpen(false); }}>
          <Dropdown.Trigger>
            <span>{sortLabel}</span>
            <img className='chevron-down-menu' src={ChevronDown} alt="Chevron Down" />
          </Dropdown.Trigger>
          <Dropdown.Panel>
            <h4 className='sort-by-title'>Sort by</h4>
            <ul className="menu-list short-panel">
              <li><button onClick={() => { onSortSelect('-created_at'); }}>New products first</button></li>
              <li><button onClick={() => { onSortSelect('price'); }}>Price, low to high</button></li>
              <li><button onClick={() => { onSortSelect('-price'); }}>Price, high to low</button></li>
            </ul>
          </Dropdown.Panel>
        </Dropdown>
      </div>
    </div>
  );
}


