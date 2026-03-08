import re

with open("components/admin/PropertiesList.tsx", "r") as f:
    content = f.read()

# Add forcedType to props
props_search = """interface PropertiesListProps {
  onAddProperty: () => void;
  onEditProperty: (id: string) => void;
}"""

props_replace = """interface PropertiesListProps {
  onAddProperty: () => void;
  onEditProperty: (id: string) => void;
  forcedType?: 'Lands' | 'Houses';
}"""

content = content.replace(props_search, props_replace)

# Modify component definition
comp_def_search = """const PropertiesList: React.FC<PropertiesListProps> = ({ onAddProperty, onEditProperty }) => {"""
comp_def_replace = """const PropertiesList: React.FC<PropertiesListProps> = ({ onAddProperty, onEditProperty, forcedType }) => {"""

content = content.replace(comp_def_search, comp_def_replace)

# Modify search and filter state
state_search = """  const [typeFilter, setTypeFilter] = useState('All');"""
state_replace = """  const [typeFilter, setTypeFilter] = useState(forcedType || 'All');

  useEffect(() => {
    if (forcedType) {
      setTypeFilter(forcedType);
    }
  }, [forcedType]);"""

content = content.replace(state_search, state_replace)


with open("components/admin/PropertiesList.tsx", "w") as f:
    f.write(content)
