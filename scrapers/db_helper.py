"""
Database helper for scrapers - works with separate tables for each bank
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


class DatabaseHelper:
    """Helper class for database operations"""

    def __init__(self, bank_table_name):
        """
        Initialize database helper for a specific bank table

        Args:
            bank_table_name: The table name for the bank (e.g., 'abb_bank', 'unibank')
        """
        self.database_url = os.getenv('DATABASE_URL')
        if not self.database_url:
            raise ValueError("DATABASE_URL not found in environment")

        self.bank_table_name = bank_table_name

    def get_connection(self):
        """Get a database connection"""
        return psycopg2.connect(self.database_url)

    def get_category_id(self, category_name):
        """Get category ID by name"""
        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id FROM cashback.categories WHERE name = %s",
                    (category_name,)
                )
                result = cur.fetchone()
                return result[0] if result else None
        finally:
            conn.close()

    def start_scraping_log(self):
        """Create a scraping log entry"""
        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO cashback.scraping_logs (bank_table_name, status)
                    VALUES (%s, %s)
                    RETURNING id
                    """,
                    (self.bank_table_name, 'running')
                )
                conn.commit()
                return cur.fetchone()[0]
        finally:
            conn.close()

    def complete_scraping_log(self, log_id, status, offers_found=0, error_message=None):
        """Update scraping log with completion status"""
        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE cashback.scraping_logs
                    SET status = %s,
                        offers_found = %s,
                        error_message = %s,
                        completed_at = %s
                    WHERE id = %s
                    """,
                    (status, offers_found, error_message, datetime.now(), log_id)
                )
                conn.commit()
        finally:
            conn.close()

    def delete_old_offers(self):
        """Delete all existing offers for this bank before scraping new data"""
        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(f"DELETE FROM cashback.{self.bank_table_name}")
                deleted_count = cur.rowcount
                conn.commit()
                return deleted_count
        finally:
            conn.close()

    def insert_offer(self, offer_data):
        """Insert a new cashback offer"""
        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO cashback.{self.bank_table_name}
                    (category_id, merchant_name, cashback_percentage,
                     cashback_amount, description, terms, start_date, end_date,
                     is_active, source_url, scraped_at)
                    VALUES (%(category_id)s, %(merchant_name)s,
                            %(cashback_percentage)s, %(cashback_amount)s,
                            %(description)s, %(terms)s, %(start_date)s,
                            %(end_date)s, %(is_active)s, %(source_url)s, %(scraped_at)s)
                    RETURNING id
                    """,
                    offer_data
                )
                conn.commit()
                return cur.fetchone()[0]
        finally:
            conn.close()

    def bulk_insert_offers(self, offers):
        """Bulk insert multiple offers"""
        if not offers:
            return 0

        conn = self.get_connection()
        try:
            with conn.cursor() as cur:
                for offer in offers:
                    cur.execute(
                        f"""
                        INSERT INTO cashback.{self.bank_table_name}
                        (category_id, merchant_name, cashback_percentage,
                         cashback_amount, description, terms, start_date, end_date,
                         is_active, source_url, scraped_at)
                        VALUES (%(category_id)s, %(merchant_name)s,
                                %(cashback_percentage)s, %(cashback_amount)s,
                                %(description)s, %(terms)s, %(start_date)s,
                                %(end_date)s, %(is_active)s, %(source_url)s, %(scraped_at)s)
                        """,
                        offer
                    )
                conn.commit()
                return len(offers)
        finally:
            conn.close()
