package com.mitra.browser.data.db

import android.content.Context
import androidx.room.*
import com.mitra.browser.data.db.entities.HistoryEntity

@Dao
interface HistoryDao {
    @Query("SELECT * FROM history ORDER BY timestamp DESC LIMIT 100")
    suspend fun getAllHistory(): List<HistoryEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: HistoryEntity)

    @Query("DELETE FROM history WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM history")
    suspend fun clearAll()
}

@Database(entities = [HistoryEntity::class], version = 1, exportSchema = false)
abstract class MitraDatabase : RoomDatabase() {
    abstract fun historyDao(): HistoryDao

    companion object {
        @Volatile
        private var INSTANCE: MitraDatabase? = null

        fun getInstance(context: Context): MitraDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MitraDatabase::class.java,
                    "mitra_browser.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
