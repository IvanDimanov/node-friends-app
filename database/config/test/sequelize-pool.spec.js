const {Sequelize, getInstance} = require('../sequelize-pool');

describe('sequelize-pool', () => {
  describe('getInstance()', () => {
    it('should always return the same DB instance', () => {
      const id = getInstance().id;

      expect(getInstance().id).to.equal(id);
      expect(getInstance().id).to.equal(id);
      expect(getInstance().id).to.equal(id);
    });
  });

  describe('Sequelize', () => {
    describe('formatLogging()', () => {
      it('should return input with single spaces only #1', () => {
        const sql = ' SELECT * FROM test ';
        const resultSql = ' SELECT * FROM test ';

        expect(Sequelize.formatLogging(sql)).to.equal(resultSql);
      });

      it('should return input with single spaces only #2', () => {
        const sql = '    SELECT * FROM test   ';
        const resultSql = ' SELECT * FROM test ';

        expect(Sequelize.formatLogging(sql)).to.equal(resultSql);
      });

      it('should return input with no indentations #1', () => {
        const sql = '\nSELECT * FROM test';
        const resultSql = ' SELECT * FROM test';

        expect(Sequelize.formatLogging(sql)).to.equal(resultSql);
      });

      it('should return input with no indentations #2', () => {
        const sql = '\tSELECT * FROM test';
        const resultSql = ' SELECT * FROM test';

        expect(Sequelize.formatLogging(sql)).to.equal(resultSql);
      });

      it('should return input with no indentations #2', () => {
        const sql = '\t\nSELECT * FROM test';
        const resultSql = ' SELECT * FROM test';

        expect(Sequelize.formatLogging(sql)).to.equal(resultSql);
      });
    });
  });
});
