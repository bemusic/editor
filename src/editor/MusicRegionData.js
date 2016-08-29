import * as SamplerRegion from '../sampler-region/SamplerRegion'

import invariant from 'invariant'

export const isSamplerRegion = (regionData) => regionData.type === 'sampler'

export const getSamplerRegion = (regionData) => {
  invariant(isSamplerRegion(regionData), 'regionData should be a “sampler” region')
  return regionData.data
}

export const length = (regionData) => {
  if (isSamplerRegion(regionData)) {
    return SamplerRegion.length(getSamplerRegion(regionData))
  }
  return regionData.data.l // FIXME
}
