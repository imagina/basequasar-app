import { createMetaMixin } from 'quasar';

function generateMetaData ()
{
  let routeTitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '');
  if (this.$route.meta && this.$route.meta.headerTitle) routeTitle = this.$route.meta.headerTitle;
  const siteName = this.$getSetting('isite::site-name');
  const siteDescription = this.$getSetting('isite::site-description');
  const iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon');
  const favicon = iconHref.id ? iconHref.path : require('/public/favicon.ico');

  return {
    title: `${this.$tr(routeTitle)} | ${siteName}`,
    meta: {
      description: { name: 'description', content: siteDescription || siteName }
    },
    link: {
      icon: { rel: 'icon', href: favicon }
    }
  };
}

export default createMetaMixin(generateMetaData);
