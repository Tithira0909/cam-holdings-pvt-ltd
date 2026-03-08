import re

with open("components/admin/Dashboard.tsx", "r") as f:
    content = f.read()

# Add Houses to sidebar
sidebar_search = """          <button
            onClick={() => { setActiveView('properties'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'properties' || activeView === 'add-property' || activeView === 'edit-property'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building size={18} />
            Properties
          </button>"""

sidebar_replace = """          <button
            onClick={() => { setActiveView('properties'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'properties' || activeView === 'add-property' || activeView === 'edit-property'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MapPin size={18} />
            Lands
          </button>

          <button
            onClick={() => { setActiveView('houses'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
              activeView === 'houses' || activeView === 'add-house' || activeView === 'edit-house'
                ? 'bg-white/10 text-luxury-gold'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Building size={18} />
            Houses
          </button>"""

content = content.replace(sidebar_search, sidebar_replace)


# Add Houses views
views_search = """        {activeView === 'edit-property' && editingPropertyId && (
          <EditProperty
            propertyId={editingPropertyId}
            onSuccess={() => setActiveView('properties')}
            onCancel={() => setActiveView('properties')}
          />
        )}"""

views_replace = """        {activeView === 'edit-property' && editingPropertyId && (
          <EditProperty
            propertyId={editingPropertyId}
            onSuccess={() => setActiveView('properties')}
            onCancel={() => setActiveView('properties')}
          />
        )}

        {activeView === 'houses' && (
          <PropertiesList
            forcedType="Houses"
            onAddProperty={() => setActiveView('add-house')}
            onEditProperty={(id) => {
              setEditingPropertyId(id);
              setActiveView('edit-house');
            }}
          />
        )}

        {activeView === 'add-house' && (
          <AddProperty
            forcedType="House"
            onSuccess={() => setActiveView('houses')}
            onCancel={() => setActiveView('houses')}
          />
        )}

        {activeView === 'edit-house' && editingPropertyId && (
          <EditProperty
            propertyId={editingPropertyId}
            onSuccess={() => setActiveView('houses')}
            onCancel={() => setActiveView('houses')}
          />
        )}"""

content = content.replace(views_search, views_replace)

# Modify the properties view to filter by Lands
properties_view_search = """        {activeView === 'properties' && (
          <PropertiesList
            onAddProperty={() => setActiveView('add-property')}
            onEditProperty={(id) => {"""

properties_view_replace = """        {activeView === 'properties' && (
          <PropertiesList
            forcedType="Lands"
            onAddProperty={() => setActiveView('add-property')}
            onEditProperty={(id) => {"""

content = content.replace(properties_view_search, properties_view_replace)

with open("components/admin/Dashboard.tsx", "w") as f:
    f.write(content)
