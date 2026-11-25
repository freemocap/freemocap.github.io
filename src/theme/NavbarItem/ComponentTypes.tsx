import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import TutorialsNavbarItem from './TutorialsNavbarItem';
import DeveloperDocsNavbarItem from './DeveloperDocsNavbarItem';
import SiteLinksNavbarItem from './SiteLinksNavbarItem';

export default {
  ...ComponentTypes,
  'custom-tutorialsDropdown': TutorialsNavbarItem,
  'custom-developerDocsDropdown': DeveloperDocsNavbarItem,
  'custom-siteLinks': SiteLinksNavbarItem,
};
