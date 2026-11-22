import test from 'node:test';
import assert from 'node:assert/strict';

// Simple JS test harness mirroring engine logic
test('Double Entry Ledger Engine - Invariant and Allocation Tests', async (t) => {
  // Mock accounts
  const accounts = {
    '1000': { code: '1000', classification: 'ASSET', balance: 0 },
    '1010': { code: '1010', classification: 'ASSET', balance: 5000000 },
    '2000': { code: '2000', classification: 'LIABILITY', balance: 0 },
    '2010': { code: '2010', classification: 'LIABILITY', balance: 0 },
    '2020': { code: '2020', classification: 'LIABILITY', balance: 0 },
    '4000': { code: '4000', classification: 'REVENUE', balance: 0 },
    '5000': { code: '5000', classification: 'EXPENSE', balance: 0 },
  };

  function postEntry(postings) {
    let debits = 0;
    let credits = 0;
    for (const p of postings) {
      debits += p.debit;
      credits += p.credit;
    }
    assert.equal(Math.round(debits * 100), Math.round(credits * 100), 'Debits must equal Credits');

    for (const p of postings) {
      const acc = accounts[p.accountCode];
      if (acc.classification === 'ASSET' || acc.classification === 'EXPENSE') {
        acc.balance += (p.debit - p.credit);
      } else {
        acc.balance += (p.credit - p.debit);
      }
    }
  }

  await t.test('1. Record 1,000 contributors contributing ₹100 each (Total: ₹1,00,000, Fee: 2%)', () => {
    const gross = 100000;
    const fee = 2000;
    const net = 98000;

    postEntry([
      { accountCode: '1000', debit: gross, credit: 0 },
      { accountCode: '2000', debit: 0, credit: net },
      { accountCode: '5000', debit: 0, credit: fee },
    ]);

    assert.equal(accounts['1000'].balance, 100000, 'Gateway Escrow holds ₹1,00,000');
    assert.equal(accounts['2000'].balance, 98000, 'Unallocated Pool holds ₹98,000');
    assert.equal(accounts['5000'].balance, -2000, 'Gateway fee recognized');
  });

  await t.test('2. Execute 30/60/10 Cycle Allocation on ₹98,000 net pool', () => {
    const net = 98000;
    const charity = Math.round(net * 0.30 * 100) / 100; // 29,400
    const beneficiary = Math.round(net * 0.60 * 100) / 100; // 58,800
    const platform = Math.round((net - charity - beneficiary) * 100) / 100; // 9,800

    assert.equal(charity + beneficiary + platform, net, 'Allocations sum exactly to net pool');

    postEntry([
      { accountCode: '2000', debit: net, credit: 0 },
      { accountCode: '2010', debit: 0, credit: charity },
      { accountCode: '2020', debit: 0, credit: beneficiary },
      { accountCode: '4000', debit: 0, credit: platform },
    ]);

    assert.equal(accounts['2000'].balance, 0, 'Unallocated pool fully cleared');
    assert.equal(accounts['2010'].balance, 29400, '30% Charity Fund has ₹29,400');
    assert.equal(accounts['2020'].balance, 58800, '60% Beneficiary Fund has ₹58,800');
    assert.equal(accounts['4000'].balance, 9800, '10% Platform Revenue has ₹9,800');
  });

  await t.test('3. Disburse grant payout of ₹30,000 from Beneficiary Fund', () => {
    const payout = 30000;
    postEntry([
      { accountCode: '2020', debit: payout, credit: 0 },
      { accountCode: '1010', debit: 0, credit: payout },
    ]);

    assert.equal(accounts['2020'].balance, 28800, 'Beneficiary fund reduced to ₹28,800');
    assert.equal(accounts['1010'].balance, 4970000, 'Bank account disbursed ₹30,000');
  });
});
