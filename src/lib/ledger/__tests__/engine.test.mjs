import test from 'node:test';
import assert from 'node:assert/strict';

test('Double Entry Ledger Engine - 5-Bucket Model (50/10/20/10/10) Invariant Tests', async (t) => {
  const accounts = {
    '1000': { code: '1000', classification: 'ASSET', balance: 0 },
    '1010': { code: '1010', classification: 'ASSET', balance: 5000000 },
    '1020': { code: '1020', classification: 'ASSET', balance: 0 },
    '2000': { code: '2000', classification: 'LIABILITY', balance: 0 },
    '2010': { code: '2010', classification: 'LIABILITY', balance: 0 },
    '2020': { code: '2020', classification: 'LIABILITY', balance: 0 },
    '2030': { code: '2030', classification: 'LIABILITY', balance: 0 },
    '2040': { code: '2040', classification: 'LIABILITY', balance: 0 },
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

  await t.test('1. Record 1,000 contributors contributing ₹100 each (Gross: ₹1,00,000, MDR: 2%)', () => {
    const gross = 100000;
    const fee = 2000;
    const net = 98000;

    postEntry([
      { accountCode: '1000', debit: gross, credit: 0 },
      { accountCode: '2000', debit: 0, credit: net },
      { accountCode: '5000', debit: 0, credit: fee },
    ]);

    assert.equal(accounts['1000'].balance, 100000, 'Gateway Clearing holds ₹1,00,000');
    assert.equal(accounts['2000'].balance, 98000, 'Unallocated Pool holds ₹98,000');
    assert.equal(accounts['5000'].balance, -2000, 'MDR processing fee recorded');
  });

  await t.test('2. Execute 50/10/20/10/10 Event Allocation on ₹98,000 net pool', () => {
    const net = 98000;
    const firstRecipient = Math.round(net * 0.50 * 100) / 100; // 49,000
    const secondRecipient = Math.round(net * 0.10 * 100) / 100; // 9,800
    const directCharity = Math.round(net * 0.20 * 100) / 100; // 19,600
    const emergencyVault = Math.round(net * 0.10 * 100) / 100; // 9,800
    const platformOps = Math.round((net - firstRecipient - secondRecipient - directCharity - emergencyVault) * 100) / 100; // 9,800

    assert.equal(firstRecipient + secondRecipient + directCharity + emergencyVault + platformOps, net, '5 buckets sum exactly to 100% of net pool');

    postEntry([
      { accountCode: '2000', debit: net, credit: 0 },
      { accountCode: '2010', debit: 0, credit: firstRecipient },
      { accountCode: '2020', debit: 0, credit: secondRecipient },
      { accountCode: '2030', debit: 0, credit: directCharity },
      { accountCode: '2040', debit: 0, credit: emergencyVault },
      { accountCode: '4000', debit: 0, credit: platformOps },
    ]);

    assert.equal(accounts['2000'].balance, 0, 'Unallocated pool cleared');
    assert.equal(accounts['2010'].balance, 49000, '50% First Recipient Payable has ₹49,000');
    assert.equal(accounts['2020'].balance, 9800, '10% Second Recipient Payable has ₹9,800');
    assert.equal(accounts['2030'].balance, 19600, '20% Charity Payable has ₹19,600');
    assert.equal(accounts['2040'].balance, 9800, '10% Emergency Vault has ₹9,800');
    assert.equal(accounts['4000'].balance, 9800, '10% Platform Revenue has ₹9,800');
  });

  await t.test('3. Execute First Recipient payout of ₹49,000', () => {
    const payout = 49000;
    postEntry([
      { accountCode: '2010', debit: payout, credit: 0 },
      { accountCode: '1010', debit: 0, credit: payout },
    ]);

    assert.equal(accounts['2010'].balance, 0, 'First recipient liability settled');
    assert.equal(accounts['1010'].balance, 4951000, 'Bank operating balance disbursed ₹49,000');
  });
});
