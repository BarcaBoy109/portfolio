import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveTheme} from '../themes.js';
test('Northern Hemisphere meteorological seasons at every month boundary',()=>{
 const expected=['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'];
 expected.forEach((season,index)=>assert.equal(resolveTheme(new Date(Date.UTC(2026,index,1,12))).key,season));
});
test('personal dates override seasons; exact dates do not repeat annually',()=>{
 const events=[{date:'10-19',title:'Birthday',theme:'celebration'},{date:'2027-06-01',title:'Graduation',theme:'celebration'}];
 assert.deepEqual(resolveTheme(new Date('2026-10-19T00:00:00Z'),events),{key:'celebration',occasion:'Birthday'});
 assert.equal(resolveTheme(new Date('2027-06-01T00:00:00Z'),events).occasion,'Graduation');
 assert.equal(resolveTheme(new Date('2028-06-01T00:00:00Z'),events).key,'summer');
});
test('uses configured timezone at midnight and ignores disabled or unknown themes',()=>{
 assert.equal(resolveTheme(new Date('2026-02-28T16:01:00Z')).key,'spring');
 assert.equal(resolveTheme(new Date('2026-02-28T15:59:00Z')).key,'winter');
 assert.equal(resolveTheme(new Date('2026-10-19T00:00:00Z'),[{date:'10-19',theme:'missing'},{date:'10-19',theme:'celebration',enabled:false}]).key,'autumn');
});
