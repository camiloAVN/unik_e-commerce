import { getSettings, getHeroImagesAdmin } from '@/actions';
import { SettingsClient } from './ui/SettingsClient';

export default async function ConfiguracionPage() {
  const [settings, heroImages] = await Promise.all([getSettings(), getHeroImagesAdmin()]);
  return <SettingsClient settings={settings} heroImages={heroImages} />;
}
