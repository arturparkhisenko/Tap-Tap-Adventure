/* global Types */

var Utils = require('./utils'),
    ItemTypes = require('../../../../shared/js/itemtypes'),
    Formulas = {};


Formulas.dmg = function(attacker, defender, spellType, spellLevel) {
    var damage, damageDealt, damageAbsorbed, usingRange, attackerLevel, defenderLevel, defenderArmourLevel, attackerArmourLevel, attackerWeaponLevel, attackerEnchantmentLevel;

    defenderArmourLevel = defender.armorLevel;
    attackerArmourLevel = attacker.armorLevel;
    attackerWeaponLevel = attacker.weaponLevel;
    attackerEnchantmentLevel = attacker.weaponEnchantedPoint;
    usingRange = attacker instanceof Player && attacker.pClass == Types.PlayerClass.ARCHER;


    attackerLevel = attacker.level;
    defenderLevel = defender.level;

    if (defenderArmourLevel == 0)
        defenderArmourLevel = 1;

    if (attackerArmourLevel == 0)
        attackerArmourLevel = 1;

    if (defenderLevel == 0)
        defenderLevel = 1;

    if (attackerLevel == 0)
        attackerLevel = 1;

    if (attackerWeaponLevel == 0)
        attackerWeaponLevel = 1;


    damageDealt = (attackerLevel * Utils.randomRange(0.25, 2.1875)) + (attackerWeaponLevel * (1.125 + (Utils.randomRange(-0.5, 0.55))) * (usingRange ? 1.15 + (Utils.randomRange(-0.45, 0.15)) : 2.15 + (Utils.randomRange(-0.95, 1.25))));

    if (attacker instanceof Player && attacker.type != 'mob') {

        if (attacker.hasRing()) {
            var ringLevel = ItemTypes.getRingLevel(attacker.getRing());

            if (ringLevel > 0)
                damageDealt = damageDealt + (damageDealt * Utils.randomRange(0.0025, (0.02 * ringLevel)));
        }

        if (attacker.hasPendant()) {
            var pendantLevel = ItemTypes.getPendantLevel(attacker.getPendant());

            if (pendantLevel > 0)
                damageDealt = damageDealt + (damageDealt * Utils.randomRange(0.0025, (0.02 * pendantLevel)));
        }

        if (attackerEnchantmentLevel > 0)
            damageDealt += (Utils.randomInt(0, attackerEnchantmentLevel) * Utils.randomRange(0.55, 1.55));
        
        if (spellType && spellLevel) {
            var spellBonus;
            if (spellType == 1)
                spellBonus = 1.111;
            else if (spellType == 4)
                spellBonus = 1.221;

            damageDealt = (attacker.level * Utils.randomRange(1.01, spellLevel) * spellBonus);
        }
    }


    damageAbsorbed = (defenderLevel + (Utils.randomRange (0, defenderArmourLevel))) * (1.115 + Utils.random(-0.35, 0.05));

    if (defender instanceof Player && defender.type != 'mob') {
        if (defender.hasRing()) {
            var rLevel = ItemTypes.getRingLevel(defender.getRing());

            if (rLevel > 0)
                damageAbsorbed = damageAbsorbed + (damageAbsorbed * Utils.randomRange(0.0025, (0.02 * rLevel)));
        }

        if (defender.hasPendant()) {
            var pLevel = ItemTypes.getPendantLevel(defender.getPendant());

            if (pLevel > 0)
                damageAbsorbed = damageAbsorbed + (damageAbsorbed * Utils.randomRange(0.0025, (0.02 * pLevel)));
        }
    }

    damageDealt = Math.round(damageDealt);
    damageAbsorbed = Math.round(damageAbsorbed);

    if (damageAbsorbed > damageDealt)
        damageAbsorbed = damageDealt - 1;

    damage = damageDealt - damageAbsorbed;

    if (damage < 0)
        damage = 0;

    damage = Math.round(damage);

    return damage;
};

Formulas.hp = function(entity) {
    return 100;
};

Formulas.mana = function(entity) {
    return 50;
};

Formulas.getExpArray = function() {
    var expArray = [0];
    
    for (var i = 1; i < 200; i++) {
        var point = Math.floor((1/4) * Math.floor(i + 300 * Math.pow(2, i / 7)));
        expArray[i] = points + expArray[i - 1];
    }
    
    return expArray;
};

Formulas.getLevelFromExp = function(exp) {
    if (exp == 0)
        return 1;

    for (var i = 1; i < 150; i++) {
        if (exp < Formulas.getExpArray()[i])
            return i;
    }

    return 150;
};

if(!(typeof exports === 'undefined')) {
    module.exports = Formulas;
}