import re

with open("components/admin/AddProperty.tsx", "r") as f:
    content = f.read()

# Add forcedType to props
props_search = """interface AddPropertyProps {
  onSuccess: () => void;
  onCancel: () => void;
}"""

props_replace = """interface AddPropertyProps {
  onSuccess: () => void;
  onCancel: () => void;
  forcedType?: 'House' | 'Land';
}"""

content = content.replace(props_search, props_replace)

# Modify component definition
comp_def_search = """const AddProperty: React.FC<AddPropertyProps> = ({ onSuccess, onCancel }) => {"""
comp_def_replace = """const AddProperty: React.FC<AddPropertyProps> = ({ onSuccess, onCancel, forcedType }) => {"""

content = content.replace(comp_def_search, comp_def_replace)

# Update state
state_search = """  const [type, setType] = useState<PropertyType>(PropertyType.LAND);"""
state_replace = """  const [type, setType] = useState<PropertyType>(forcedType === 'House' ? PropertyType.HOUSE : PropertyType.LAND);"""

content = content.replace(state_search, state_replace)

# Disable or filter type select
select_search = """                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PropertyType)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold"
                      required
                    >
                      {Object.values(PropertyType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>"""

select_replace = """                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PropertyType)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold"
                      required
                      disabled={!!forcedType}
                    >
                      {Object.values(PropertyType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>"""

content = content.replace(select_search, select_replace)

with open("components/admin/AddProperty.tsx", "w") as f:
    f.write(content)
