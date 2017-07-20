import { callFunc } from './func'
import { phoneReg } from './regex'
import formatter from './formatter'
import * as reactUtil from './react-utils'
import * as sematicUtil from './semantic-ui-react-utils'
module.exports = {
    callFunc, phoneReg, formatter,
    ...reactUtil,
    ...sematicUtil,
}