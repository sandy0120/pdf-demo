import i18n from '@/plugins/i18nPlugin'

export const $validate = {
  required: (msg: string) => {
    return {
      required: true,
      trigger: 'change',
      message: i18n.global.t('validate_required', { msg })
    }
  },
  max: (max: number) => {
    return {
      max: max,
      message: i18n.global.t('validate_max', { max }),
      trigger: 'blur'
    }
  },
  min: (min: number) => {
    return {
      min: min,
      message: i18n.global.t('validate_min', { min }),
      trigger: 'blur'
    }
  },
  length: (min: number, max: number) => {
    return {
      min: min,
      max: max,
      message: i18n.global.t('validate_length', { min, max }),
      trigger: 'blur'
    }
  },
  maxOnceDataset: (size: number, piece: number) => {
    const maxOnceSize = 500 * 1024 * 1024 //一次最大 500MB
    const MaxOncePiece = 1000 //一次最多1000張

    return size > maxOnceSize || piece > MaxOncePiece ? false : true
  },
  validateFileType: (x: any) => {
    let { name } = x
    name = name.split('.')
    if (
      x.type !== 'image/png' &&
      // x.type !== 'image/jpeg' &&
      x.type !== 'application/dicom' &&
      (!(name.length > 1) ||
        (name[name.length - 1] !== 'PNG' &&
          name[name.length - 1] !== 'png' &&
          name[name.length - 1] !== 'DCM' &&
          // name[name.length - 1] !== 'jpeg' &&
          name[name.length - 1] !== 'dcm'))
    ) {
      return false
    } else {
      return true
    }
  },
  validateFileSize: (x: any) => {
    const { size } = x
    return size > 50 * 1024 * 1024 ? false : true
  },
  validateFileName: (x: any) => {
    const { name } = x
    const reg = /[~#^$@%&!?%*[\]]/gi
    // return reg.test(name)
    return false
  },
  validateName: (name: any) => {
    if (name.length) {
      const reg = /^[\u4e00-\u9fa5 a-zA-Z]+$/gi //接受中,英文,空格
      return reg.test(name)
    } else {
      return true
    }
  }
}
